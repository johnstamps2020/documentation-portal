'use strict';

require('dotenv').config();
const tracer = require('dd-trace').init();
const {
  expressWinstonLogger,
  expressWinstonErrorLogger,
  winstonLogger,
} = require('./controllers/loggerController');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const session = require('cookie-session');
const httpContext = require('express-http-context');

const app = express();
app.use(expressWinstonLogger);
app.use(function (req, res, next) {
  const hostnamesToReplace = [
    'portal2.guidewire.com',
    'documentation.guidewire.com',
  ];
  if (hostnamesToReplace.includes(req.hostname)) {
    const fullRequestUrl = new URL(req.url, process.env.APP_BASE_URL);
    res.redirect(fullRequestUrl.href);
    return;
  } else {
    next();
  }
});

if (process.env.NODE_ENV === 'development') {
  const cors = require('cors');
  app.use(cors());
}

const options = {
  etag: true,
  maxAge: 3600000,
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set({
      'x-timestamp': Date.now(),
      'Cache-Control': 'public, max-age: 3600',
    });
  },
};

winstonLogger.notice('Server app instantiated!');

const sessionSettings = {
  name: 'session',
  secret: process.env.SESSION_KEY,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  sameSite: 'none',
  secure: true,
};

if (process.env.LOCALHOST_SESSION_SETTINGS === 'yes') {
  sessionSettings.sameSite = 'lax';
  sessionSettings.secure = false;
}

// session support is required to use ExpressOIDC
app.set('trust proxy', 1);
app.use(session(sessionSettings));

/* 
Dummy implementation of regenerate and save functions is a workaround
for using passport 0.6.0 with cookie-session. This workaround is needed until the known issue
is resolved by the library maintainer: https://github.com/jaredhanson/passport/issues/904
The upgrade to version 0.6.x was required because passport 0.5.x
contains "CVE-2022-25896 4.8 Session Fixation vulnerability pending CVSS allocation".
*/
// Workaround start
app.use(function (req, res, next) {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});
// Workaround end

const gwLoginRouter = require('./routes/gw-login');
const gwLogoutRouter = require('./routes/gw-logout');
const partnersLoginRouter = require('./routes/partners-login');
const customersLoginRouter = require('./routes/customers-login');
const oidcLoginRouter = require('./routes/authorization-code');
const searchRouter = require('./routes/search');
const unauthorizedRouter = require('./routes/unauthorized');
const internalRouter = require('./routes/internal');
const supportRouter = require('./routes/support');
const s3Router = require('./routes/s3');
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

app.use(express.json());
app.use('/jira', jiraRouter);
app.use('/gw-login', gwLoginRouter);
app.use('/gw-logout', gwLogoutRouter);
app.use('/partners-login', partnersLoginRouter);
app.use('/customers-login', customersLoginRouter);
app.use('/authorization-code', oidcLoginRouter);

// serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public'), options));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const authGateway = require('./controllers/authController').authGateway;

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
app.use(authGateway);
const getPage = require('./controllers/frontendController').getPage;
app.use(getPage);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(httpContext.middleware);

app.use('/unauthorized', unauthorizedRouter);
app.use('/internal', internalRouter);
app.use('/search', searchRouter);
app.use('/404', missingPageRouter);
app.use('/userInformation', userRouter);
app.use('/safeConfig', configRouter);
app.use('/lrs', lrsRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/support', supportRouter);
app.use('/s3', s3Router);

app.use('/portal-config/*', (req, res) => {
  res.redirect('/unauthorized');
});

app.use('/legacy*', (req, res) => {
  res.redirect('/unauthorized');
});

// overwrite HTML received through proxy
const { harmonRouter } = require('./routes/proxy-harmon-router');
app.use(harmonRouter);

// set up proxies
const {
  portal2Proxy,
  s3Proxy,
  html5Proxy,
} = require('./controllers/proxyController');

// Portal 2: Electric Boogaloo
app.use('/portal', portal2Proxy);

// HTML5 scripts, local or S3
if (process.env.NODE_ENV === 'development') {
  app.use(
    express.static(path.join(__dirname, '../html5/static/html5'), options)
  );
} else {
  app.use('/scripts', html5Proxy);
}

// All remaining docs from S3
app.use(s3Proxy);

// handles unauthorized errors
app.use(expressWinstonErrorLogger);
app.use((err, req, res, next) => {
  winstonLogger.error(
    `General error passed to top-level handler in app.js: ${JSON.stringify(
      err
    )}`
  );
  if (err.httpStatusCode === 304) {
    res.status(304).redirect('/unauthorized');
  }
  if (err.httpStatusCode === 404) {
    res.status(404).redirect('/404');
  }
  err.status = err.status || 500;
  res.status(err.status || 500).render('error', { err });
});

module.exports = app;
