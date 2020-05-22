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
const localServiceName = require(__dirname + '/package.json').name;

const ctxImpl = new ExplicitContext();
const zipkinUrl = process.env.ZIPKIN_URL;
console.log('Zipkin URL: ' + zipkinUrl);
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: zipkinUrl,
    jsonEncoder: JSON_V2,
  }),
});

const tracer = new Tracer({ ctxImpl, recorder, localServiceName });

const port = process.env.PORT || 8081;
const app = express();

// session support is required to use ExpressOIDC
app.use(
  session({
    secret: `${process.env.SESSION_KEY}`,
    resave: true,
    saveUninitialized: false,
  })
);

const gwLoginRouter = require('./routes/gw-login');
const partnersLoginRouter = require('./routes/partners-login');
const customersLoginRouter = require('./routes/customers-login');
const landingRouter = require('./routes/landing');
const cloudProductRouter = require('./routes/cloud-products');
const searchRouter = require('./routes/search');
const unauthorizedRouter = require('./routes/unauthorized');
const supportRouter = require('./routes/support');
const missingPageRouter = require('./routes/404');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/alive', (req, res, next) => {
  res.sendStatus(200);
});

app.use('/support', supportRouter);
app.use('/gw-login', gwLoginRouter);
app.use('/partners-login', partnersLoginRouter);
app.use('/customers-login', customersLoginRouter);

// serve docs from the public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

const oktaOIDC = require('./controllers/authController').oktaOIDC;
const authGateway = require('./controllers/authController').authGateway;
// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oktaOIDC.router);
app.use(authGateway);

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


app.use('/unauthorized', unauthorizedRouter);
app.use('/search', searchRouter);
app.use('/404', missingPageRouter);

app.use('/', landingRouter);
app.use('/products', cloudProductRouter);

const proxyOptions = {
  target: `${process.env.DOC_S3_URL}`,
  changeOrigin: true,
  onOpen: proxySocket => {
    proxySocket.on('data', hybiParseAndLogMessage);
  },
};
const docProxy = proxy(proxyOptions);
app.use('/', docProxy);

// handles unauthorized errors
app.use((err, req, res, next) => {
  if (err.httpStatusCode === 304) {
    res.status(304).redirect('/unauthorized');
  }
  if (err.httpStatusCode === 404) {
    res.status(404).redirect('/404');
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
