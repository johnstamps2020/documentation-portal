require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const proxy = require('http-proxy-middleware');
const favicon = require('serve-favicon');
const elasticlunr = require('elasticlunr');
const docJson = require('./public/documents.json');

const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const port = process.env.PORT || 8081;

const app = express();

const searchIndex = elasticlunr();
searchIndex.addField('title');
searchIndex.addField('body');
searchIndex.setRef('id');

const JSONStream = require('JSONStream');
const fs = require('fs');

const stream = fs.createReadStream('./public/documents.json', {encoding: 'utf8'});
const parser = JSONStream.parse('*');

stream.pipe(parser);

parser.on('data', obj => {
  searchIndex.addDoc(obj);
});

parser.on('end', () => {
  console.log('FINISHED LOADING SEARCH INDEX FROM FILE');
});

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

app.use('/search', (req, res, next) => {
  const resultsPerPage = 10;
  const currentPage = req.query.page || 1;
  const searchResults = searchIndex.search(req.query.q, {
    fields: {
      title: { boost: 2 },
      body: { boost: 1 },
    },
  });

  const totalNumOfResults = searchResults.length;

  const resultWindow = searchResults.slice(
    resultsPerPage * (currentPage - 1),
    resultsPerPage * currentPage <= totalNumOfResults - 1
      ? resultsPerPage * currentPage
      : totalNumOfResults - 1
  );

  const resultsToDisplay = resultWindow.map(result => {
    const doc = searchIndex.documentStore.getDoc(result.ref);
    return {
      ref: result.ref,
      score: result.score,
      title: doc.title,
      body: doc.body.substr(0, 300),
    };
  });

  res.render('search', {
    query: decodeURI(req.query.q),
    currentPage: currentPage,
    pages: Math.ceil(totalNumOfResults / resultsPerPage),
    totalNumOfResults: totalNumOfResults,
    searchResults: resultsToDisplay,
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
