require('dotenv').config();
const tracer = require('dd-trace').init();
const {
  expressWinstonLogger,
  expressWinstonErrorLogger,
} = require('./controllers/loggerController');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');
const favicon = require('serve-favicon');
const session = require('express-session');
const httpContext = require('express-http-context');
const port = process.env.PORT || 8081;

const app = express();
app.use(expressWinstonLogger);
app.use(function(req, res, next) {
  const hostnamesToReplace = ['portal2.guidewire.com'];
  if (hostnamesToReplace.includes(req.hostname)) {
    const fullRequestUrl = new URL(req.url, process.env.APP_BASE_URL);
    res.redirect(fullRequestUrl.href);
  } else {
    next();
  }
});

const options = {
  etag: true,
  maxAge: 3600000,
  redirect: false,
  setHeaders: function(res, path, stat) {
    res.set({
      'x-timestamp': Date.now(),
      'Cache-Control': 'public, max-age: 3600',
    });
  },
};

console.log('Server app instantiated!');

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

const gwLoginRouter = require('./routes/gw-login');
const gwLogoutRouter = require('./routes/gw-logout');
const oidcLoginRouter = require('./routes/authorization-code');
const searchRouter = require('./routes/search');
const unauthorizedRouter = require('./routes/unauthorized');
const internalRouter = require('./routes/internal');
const supportRouter = require('./routes/support');
const missingPageRouter = require('./routes/404');
const userRouter = require('./routes/user');
const configRouter = require('./routes/config');
const jiraRouter = require('./routes/jira');
const lrsRouter = require('./routes/lrs');
const recommendationsRouter = require('./routes/recommendations');
const passport = require('passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/alive', (req, res, next) => {
  res.sendStatus(200);
});

app.use('/gw-login', gwLoginRouter);
app.use('/gw-logout', gwLogoutRouter);
app.use('/authorization-code', oidcLoginRouter);

// serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public'), options));
app.use(express.static(path.join(__dirname, 'static', 'sitemap')));
app.use(express.static(path.join(__dirname, 'static', 'html5')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const authGateway = require('./controllers/authController').authGateway;

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(authGateway);
const getPage = require('./controllers/frontendController').getPage;
app.use(getPage);

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
app.use('/internal', internalRouter);
app.use('/search', searchRouter);
app.use('/404', missingPageRouter);
app.use('/userInformation', userRouter);
app.use('/safeConfig', configRouter);
app.use('/jira', jiraRouter);
app.use('/lrs', lrsRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/support', supportRouter);

function setResCacheControlHeader(proxyRes, req, res) {
  if (proxyRes.headers['content-type']?.includes('html')) {
    proxyRes.headers['Cache-Control'] = 'no-store';
  }
}

const portal2ProxyOptions = {
  target: `${process.env.PORTAL2_S3_URL}`,
  changeOrigin: true,
  onProxyRes: setResCacheControlHeader,
  onOpen: proxySocket => {
    proxySocket.on('data', hybiParseAndLogMessage);
  },
};
const portal2Proxy = createProxyMiddleware(portal2ProxyOptions);
app.use('/portal', portal2Proxy);

const s3ProxyOptions = {
  target: `${process.env.DOC_S3_URL}`,
  changeOrigin: true,
  onProxyRes: setResCacheControlHeader,
  onOpen: proxySocket => {
    proxySocket.on('data', hybiParseAndLogMessage);
  },
};
const s3Proxy = createProxyMiddleware(s3ProxyOptions);
app.use(s3Proxy);

app.use('/portal-config/*', (req, res) => {
  res.redirect('/unauthorized');
});

// handles unauthorized errors
app.use(expressWinstonErrorLogger);
app.use((err, req, res, next) => {
  if (err.httpStatusCode === 304) {
    res.status(304).redirect('/unauthorized');
  }
  if (err.httpStatusCode === 404) {
    res.status(404).redirect('/404');
  }
  err.status = err.status || 500;
  res.render('error', { err });
});

app.listen(port, () => {
  console.log('Running on PORT: ' + port);
});

module.exports = app;
