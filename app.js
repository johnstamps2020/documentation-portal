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

const proxyOptions = {
  target: `${process.env.DOC_S3_URL}`,
  changeOrigin: true,
  onOpen: proxySocket => {
    proxySocket.on('data', hybiParseAndLogMessage);
  },
};
const docProxy = proxy(proxyOptions);

const getAllowedFilterValues = async function(fieldName) {
  const { body } = await elasticClient.search({
    index: searchIndexName,
    size: 0,
    body: {
      aggs: {
        allowedForField: {
          terms: { field: fieldName },
        },
      },
    },
  });

  return body.aggregations.allowedForField.buckets.map(bucket => bucket.key);
};

const getAllowedFilters = async function() {
  const { body } = await elasticClient.indices.getMapping({
    index: searchIndexName,
  });

  const filters = body[searchIndexName].mappings.properties;
  let filtersWithValues = [];
  for (const key in filters) {
    if (filters[key].type === 'keyword') {
      filtersWithValues.push({
        name: key,
        values: await getAllowedFilterValues(key),
      });
    }
  }

  return filtersWithValues;
};

const runSearch = async function(
  searchQuery,
  platformArray,
  productArray,
  versionArray,
  startIndex,
  resultsPerPage
) {
  let query = {
    bool: {
      must: {
        multi_match: {
          query: searchQuery,
          fields: ['title^3', 'body'],
        },
      },
    },
  };

  if (platformArray || productArray || versionArray) {
    const searchFilter = Object.entries({
      platform: platformArray,
      product: productArray,
      version: versionArray,
    })
      .map(([key, value]) => value && { terms: { [key]: value } })
      .filter(Boolean);

    query.bool.filter = searchFilter;
  }

  const { body } = await elasticClient.search({
    index: searchIndexName,
    from: startIndex,
    size: resultsPerPage,
    body: {
      query: query,
    },
  });
  const allowedPlatformValues = await getAllowedFilterValues('platform');
  const allowedProductValues = await getAllowedFilterValues('product');
  const allowedVersionValues = await getAllowedFilterValues('version');

  return {
    numberOfHits: body.hits.total.value,
    hits: body.hits.hits,
    allowedPlatformValues: allowedPlatformValues,
    allowedProductValues: allowedProductValues,
    allowedVersionValues: allowedVersionValues,
  };
};

app.use('/search', async (req, res, next) => {
  const getArrayFromParam = param => {
    if (!param) {
      return undefined;
    }
    return decodeURI(param).split(' ');
  };

  const allowedFilters = await getAllowedFilters();
  console.log('ALLOWED FILTERS', JSON.stringify(allowedFilters, null, 4));

  const resultsPerPage = 10;
  const currentPage = req.query.page || 1;
  const startIndex = resultsPerPage * (currentPage - 1);
  runSearch(
    req.query.q,
    getArrayFromParam(req.query.platform),
    getArrayFromParam(req.query.product),
    getArrayFromParam(req.query.version),
    startIndex,
    resultsPerPage
  )
    .then(results => {
      const totalNumOfResults = results.numberOfHits;

      const resultsToDisplay = results.hits.map(result => {
        const doc = result._source;
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
          platform: doc.platform,
          product: doc.product,
          version: doc.version,
        };
      });

      const getSelectedValues = fieldName => {
        if (req.query[fieldName]) {
          return getArrayFromParam(req.query[fieldName]);
        }
        return undefined;
      };

      const getFilterStatesFromUrl = (valueSet, fieldName) => {
        let valuesWithStates = new Array();
        valueSet.forEach(result => {
          let value = {
            label: result,
            checked: false,
          };

          if (getSelectedValues(fieldName)) {
            if (getSelectedValues(fieldName).includes(value.label)) {
              value.checked = true;
            }
          }

          if (!valuesWithStates.some(e => e.label === value.label)) {
            valuesWithStates.push(value);
          }
        });

        console.log('VALUES WITH STATES', valuesWithStates);

        return valuesWithStates;
      };

      res.render('search', {
        query: decodeURI(req.query.q),
        currentPage: currentPage,
        pages: Math.ceil(totalNumOfResults / resultsPerPage),
        totalNumOfResults: totalNumOfResults,
        searchResults: resultsToDisplay,
        availablePlatforms: getFilterStatesFromUrl(
          results.allowedPlatformValues,
          'platform'
        ),
        availableProducts: getFilterStatesFromUrl(
          results.allowedProductValues,
          'product'
        ),
        availableVersions: getFilterStatesFromUrl(
          results.allowedVersionValues,
          'version'
        ),
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.use('/', docProxy);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
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
