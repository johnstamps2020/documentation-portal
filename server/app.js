process.on('unhandledRejection', function(reason, p) {
  console.log(reason, p);
  process.exit(1);
});

require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');
const proxy = require('http-proxy-middleware');
const favicon = require('serve-favicon');
const session = require('express-session');
const httpContext = require('express-http-context');

const port = process.env.PORT || 8081;
const app = express();
console.log('Server app instantiated!');

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const sessionSettings = {
  secret: `${process.env.SESSION_KEY}`,
  resave: true,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',
    secure: true,
  },
};

if (process.env.LOCALHOST_SESSION_SETTINGS === 'yes') {
  sessionSettings.cookie = {
    sameSite: 'lax',
    secure: false,
  };
}

// session support is required to use ExpressOIDC
app.set('trust proxy', 1);
app.use(session(sessionSettings));

const homeRouter = require('./routes/home');
const gwLoginRouter = require('./routes/gw-login');
const gwLogoutRouter = require('./routes/gw-logout');
const partnersLoginRouter = require('./routes/partners-login');
const customersLoginRouter = require('./routes/customers-login');
const cloudProductsRouter = require('./routes/cloud-products');
const selfManagedProductsRouter = require('./routes/self-managed-products');
const searchRouter = require('./routes/search');
const allProductsRouter = require('./routes/all-products');
const unauthorizedRouter = require('./routes/unauthorized');
const supportRouter = require('./routes/support');
const missingPageRouter = require('./routes/404');
const userRouter = require('./routes/user');
const configRouter = require('./routes/config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/alive', (req, res, next) => {
  res.sendStatus(200);
});

app.use('/support', supportRouter);
app.use('/gw-login', gwLoginRouter);
app.use('/gw-logout', gwLogoutRouter);
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

app.use('/unauthorized', unauthorizedRouter);
app.use('/search', searchRouter);
app.use('/404', missingPageRouter);
app.use('/userInformation', userRouter);
app.use('/safeConfig', configRouter);

app.use('/selfManagedProducts', selfManagedProductsRouter);
app.use('/cloudProducts', cloudProductsRouter);
app.use('/product', allProductsRouter);
app.use('/', homeRouter);

const portal2ProxyOptions = {
  target: 'https://portal2.guidewire.com',
  changeOrigin: true,
  onOpen: proxySocket => {
    proxySocket.on('data', hybiParseAndLogMessage);
  },
};
const portal2Proxy = proxy(portal2ProxyOptions);
app.use('/portal', portal2Proxy);

const s3ProxyOptions = {
  target: `${process.env.DOC_S3_URL}`,
  changeOrigin: true,
  onOpen: proxySocket => {
    proxySocket.on('data', hybiParseAndLogMessage);
  },
};
const s3Proxy = proxy(s3ProxyOptions);
app.use(s3Proxy);

app.use('/portal-config/*', (req, res) => {
  res.redirect('/unauthorized');
});

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

app.listen(port, () => {
  console.log('Running on PORT: ' + port);
});

module.exports = app;
