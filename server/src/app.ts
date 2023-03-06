import * as dotenv from 'dotenv';

//IMPORTANT: Don't move this line. Be careful with optimizing imports.
dotenv.config();
//
import 'reflect-metadata';
import {
  expressWinstonErrorLogger,
  expressWinstonLogger,
  winstonLogger,
} from './controllers/loggerController';
import express, { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import session from 'cookie-session';
import httpContext from 'express-http-context';
import { AppDataSource } from './model/connection';
import { runningInDevMode } from './controllers/utils/serverUtils';
import { ReqUser } from './controllers/userController';
import {
  isAllowedToAccessPageOrDoc,
  isAllowedToAccessRoute,
  saveUserInfoToResLocals,
} from './controllers/authController';
import { forbiddenRoute, fourOhFourRoute } from './controllers/proxyController';

declare global {
  namespace Express {
    interface Request {
      isAuthenticated?: () => boolean;
      user?: ReqUser;
    }
  }
}

AppDataSource.initialize()
  .then(() => {
    winstonLogger.notice('Data Source has been initialized!');
  })
  .catch((err) => {
    winstonLogger.error('Error during Data Source initialization', err);
  });

const app = express();
app.use(expressWinstonLogger);
app.use(function (req, res, next) {
  const hostnamesToReplace = ['portal2.guidewire.com'];
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
  setHeaders: function (res: Response) {
    res.set({
      'x-timestamp': Date.now(),
      'Cache-Control': 'public, max-age: 3600',
    });
  },
};

winstonLogger.notice('Server app instantiated!');

const sessionSettings: CookieSessionInterfaces.CookieSessionOptions = {
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
    req.session.regenerate = (cb: () => void) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb: () => void) => {
      cb();
    };
  }
  next();
});
// Workaround end

const gwLogoutRouter = require('./routes/gw-logout');
const partnersLoginRouter = require('./routes/partners-login');
const customersLoginRouter = require('./routes/customers-login');
const oidcLoginRouter = require('./routes/authorization-code');
const searchRouter = require('./routes/search');
const s3Router = require('./routes/s3');
const userRouter = require('./routes/user');
const configRouter = require('./routes/config');
const jiraRouter = require('./routes/jira');
const lrsRouter = require('./routes/lrs');
const recommendationsRouter = require('./routes/recommendations');
const passport = require('passport');

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/alive', (req, res) => {
  res.sendStatus(200);
});

app.use('/gw-logout', gwLogoutRouter);
app.use('/partners-login', partnersLoginRouter);
app.use('/customers-login', customersLoginRouter);
app.use('/authorization-code', oidcLoginRouter);

// serve static assets from the public folder
app.use(express.static(join(__dirname, 'public'), options));
app.use(favicon(join(__dirname, 'public', 'favicon.ico')));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user: any, done: any) {
  done(null, user);
});
passport.deserializeUser(function (user: any, done: any) {
  done(null, user);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(httpContext.middleware);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === '/') {
    return res.redirect('/landing');
  }
  return next();
});
app.use(
  '/safeConfig',
  saveUserInfoToResLocals,
  isAllowedToAccessRoute,
  configRouter
);
app.use('/jira', saveUserInfoToResLocals, isAllowedToAccessRoute, jiraRouter);
app.use('/lrs', saveUserInfoToResLocals, isAllowedToAccessRoute, lrsRouter);
app.use('/s3', saveUserInfoToResLocals, isAllowedToAccessRoute, s3Router);
// Open routes
app.use('/recommendations', recommendationsRouter);
app.use('/userInformation', userRouter);
app.use('/search', saveUserInfoToResLocals, searchRouter);

app.use('/portal-config/*', (req, res) => {
  res.redirect(
    `${forbiddenRoute}${req.url ? `?unauthorized=${req.originalUrl}` : ''}`
  );
});

// overwrite HTML received through proxy
const { harmonRouter } = require('./routes/proxy-harmon-router');
app.use(harmonRouter);

// set up proxies
const {
  sitemapProxy,
  s3Proxy,
  html5Proxy,
  reactAppProxy,
} = require('./controllers/proxyController');
app.use('/sitemap*', sitemapProxy);
app.use(
  '/landing',
  saveUserInfoToResLocals,
  isAllowedToAccessPageOrDoc,
  reactAppProxy
);

// HTML5 scripts, local or S3
const isDevMode = runningInDevMode();
if (isDevMode) {
  app.use(express.static(join(__dirname, '../static/html5'), options));
} else {
  app.use('/scripts', html5Proxy);
}

// Docs stored on S3 — current and portal2
app.use(saveUserInfoToResLocals, isAllowedToAccessPageOrDoc, s3Proxy);

app.use((req: Request, res: Response, next: NextFunction) => {
  const notFoundParam =
    req.url === '/404'
      ? req.headers.referer?.replace(`${process.env.APP_BASE_URL}`, '')
      : req.url;
  return res.redirect(
    `${fourOhFourRoute}${notFoundParam && `?notFound=${notFoundParam}`}`
  );
});
// handles unauthorized errors
app.use(expressWinstonErrorLogger);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  winstonLogger.error(
    `General error passed to top-level handler in app.ts: ${JSON.stringify(
      err
    )}`
  );
  res.status(500).render('error', { err });
});

export default app;
