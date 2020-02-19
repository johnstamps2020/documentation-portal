require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const proxy = require('http-proxy-middleware');
const favicon = require('serve-favicon');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const httpContext = require('express-http-context');
const zipkinMiddleware = require('zipkin-instrumentation-express')
  .expressMiddleware;
const addZipkinHeaders = require('zipkin').Request.addZipkinHeaders;
const { HttpLogger } = require('zipkin-transport-http');
const {
  Tracer,
  ExplicitContext,
  BatchRecorder,
  jsonEncoder: { JSON_V2 },
} = require('zipkin');
const appLogger = require('./logger');
const localServiceName = require(__dirname + '/package.json').name;

const ctxImpl = new ExplicitContext();
const zipkinUrl = process.env.ZIPKIN_URL;
console.log('ZipkinUrl: ' + zipkinUrl);
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: zipkinUrl,
    jsonEncoder: JSON_V2,
  }),
});

const tracer = new Tracer({ ctxImpl, recorder, localServiceName });

const port = process.env.PORT || 8081;
const elasticClient = require('./elastic_search/elasticClient');
const searchIndexName = 'gw-docs';
const app = express();

// session support is required to use ExpressOIDC
app.use(
  session({
    secret: `${process.env.SESSION_KEY}`,
    resave: true,
    saveUninitialized: false,
  })
);

const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_DOMAIN}`,
  client_id: `${process.env.OKTA_CLIENT_ID}`,
  client_secret: `${process.env.OKTA_CLIENT_SECRET}`,
  appBaseUrl: `${process.env.APP_BASE_URL}`,
  scope: 'openid profile',
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/alive', (req, res, next) => {
  res.sendStatus(200);
});

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);
app.use(oidc.ensureAuthenticated());

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  })
);
// serve docs from the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(httpContext.middleware);
app.use(zipkinMiddleware({ tracer }));
const xB3TraceId = 'x-b3-traceid';
const xB3ParentSpanId = 'x-b3-parentspanid';
const xB3SpanId = 'x-b3-spanid';
const xB3Flags = 'x-b3-flags';
const xB3Sampled = 'x-b3-sampled';

// add incoming trace headers to the context.
app.use(function(req, res, next) {
  const traceId = ctxImpl.getContext().traceId;
  const parentId = ctxImpl.getContext().parentId;
  const spanId = ctxImpl.getContext().spanId;
  const flags = ctxImpl.getContext().flags;
  const sampled = ctxImpl.getContext().sampled;
  httpContext.set(xB3TraceId, traceId);
  httpContext.set(xB3ParentSpanId, parentId);
  httpContext.set(xB3SpanId, spanId);
  httpContext.set(xB3Flags, flags);
  httpContext.set(xB3Sampled, sampled);
  addZipkinHeaders(req, ctxImpl.getContext());

  res.setHeader(xB3TraceId, traceId);
  res.setHeader(xB3ParentSpanId, parentId);
  res.setHeader(xB3SpanId, spanId);
  res.setHeader(xB3Flags, xB3Flags);
  res.setHeader(xB3Sampled, sampled);

  next();
});

const proxyOptions = {
  target: `${process.env.DOC_S3_URL}`,
  changeOrigin: true,
  onOpen: proxySocket => {
    proxySocket.on('data', hybiParseAndLogMessage);
  },
};
const docProxy = proxy(proxyOptions);

const getAllowedFilterValues = async function(fieldName, query) {
  const requestBody = {
    index: searchIndexName,
    size: 0,
    body: {
      aggs: {
        allowedForField: {
          filter: query,
          aggs: {
            keywordFilter: { terms: { field: fieldName } },
          },
        },
      },
    },
  };

  const result = await elasticClient.search(requestBody);

  return result.body.aggregations.allowedForField.keywordFilter.buckets.map(
    bucket => bucket.key
  );
};

app.use('/unauthorized', (req, res) => {
  res.render('unauthorized');
});

const runFilteredSearch = async (urlParams, startIndex, resultsPerPage) => {
  let queryBody = {
    bool: {
      must: {
        multi_match: {
          query: urlParams.q,
          fields: ['title^3', 'body'],
        },
      },
    },
  };

  const mappingResults = await elasticClient.indices.getMapping({
    index: searchIndexName,
  });

  const mappings = mappingResults.body[searchIndexName].mappings.properties;

  let selectedFilters = [];
  for (const param in urlParams) {
    if (mappings[param] && mappings[param].type == 'keyword') {
      const values = decodeURI(urlParams[param]).split(',');
      const queryFilter = {
        terms: {
          [param]: values,
        },
      };
      selectedFilters.push(queryFilter);
    }
  }

  if (selectedFilters.length > 0) {
    queryBody.bool.filter = selectedFilters;
  }

  let filtersWithValues = [];
  for (const key in mappings) {
    if (mappings[key].type === 'keyword') {
      const allowedFilterValues = await getAllowedFilterValues(key, queryBody);
      const filterValuesWithStates = allowedFilterValues.map(value => {
        const checked = decodeURI(urlParams[key])
          .split(',')
          .includes(value);
        return {
          label: value,
          checked: checked,
        };
      });
      filtersWithValues.push({
        name: key,
        values: filterValuesWithStates,
      });
    }
  }

  const searchResults = await elasticClient.search({
    index: searchIndexName,
    from: startIndex,
    size: resultsPerPage,
    body: {
      query: queryBody,
    },
  });

  return {
    numberOfHits: searchResults.body.hits.total.value,
    hits: searchResults.body.hits.hits,
    filters: filtersWithValues,
  };
};

app.use('/search', async (req, res, next) => {
  try {
    if (!req.query || !req.query.q) {
      next(new Error('Query string not specified'));
    }

    const resultsPerPage = 10;
    const currentPage = req.query.page || 1;
    const startIndex = resultsPerPage * (currentPage - 1);
    const results = await runFilteredSearch(
      req.query,
      startIndex,
      resultsPerPage
    );

    const filters = results.filters;

    const totalNumOfResults = results.numberOfHits;

    const resultsToDisplay = results.hits.map(result => {
      const doc = result._source;
      let docTags = [];
      for (const key in doc) {
        if (filters.some(filter => filter.name === key)) {
          docTags.push(doc[key]);
        }
      }

      const getBlurb = body => {
        if (body) {
          return body.substr(0, 300) + '...';
        }
        return 'DOCUMENT HAS NO CONTENT';
      };

      return {
        ref: doc.id,
        score: result._score,
        title: doc.title,
        body: getBlurb(doc.body),
        docTags: docTags,
      };
    });

    const retrievedTags = [];

    resultsToDisplay.forEach(result => {
      result.docTags.forEach(tag => {
        if (!retrievedTags.includes(tag)) {
          retrievedTags.push(tag);
        }
      });
    });

    res.render('search', {
      query: decodeURI(req.query.q),
      currentPage: currentPage,
      pages: Math.ceil(totalNumOfResults / resultsPerPage),
      totalNumOfResults: totalNumOfResults,
      searchResults: resultsToDisplay,
      filters: filters,
    });
  } catch (err) {
    appLogger.log({
      level: 'error',
      message: `Exception while running search: ${err}`,
    });
    next(err);
  }
});

app.use('/', docProxy);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// handles unauthorized errors
app.use((err, req, res, next) => {
  if (err.httpStatusCode === 304) {
    res.status(304).redirect('/unauthorized');
  }
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log('Running on PORT: ' + port);
});

module.exports = app;
