const { Issuer, Strategy } = require('openid-client');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { winstonLogger } = require('../controllers/loggerController');

Issuer.discover(process.env.OKTA_DOMAIN)
  .then(oktaIssuer => {
    router.use(cookieParser());
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    const oktaClient = new oktaIssuer.Client({
      client_id: process.env.OKTA_CLIENT_ID,
      client_secret: process.env.OKTA_CLIENT_SECRET,
      redirect_uris: [
        `${process.env.APP_BASE_URL}/authorization-code/callback`,
      ],
    });

    const oidcStrategy = new Strategy(
      {
        client: oktaClient,
        params: {
          scope: 'openid profile email',
        },
      },
      function(tokenSet, profile, done) {
        return done(null, profile);
      }
    );
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    passport.deserializeUser(function(user, done) {
      done(null, user);
    });
    passport.use('oidcStrategy', oidcStrategy);
    router.use(passport.initialize());
    router.use(passport.session());

    router.get(
      '/',
      function(req, res, next) {
        delete oidcStrategy._params.idp;
        if (req.query.idp === 'okta') {
          oidcStrategy._params.idp = process.env.OKTA_IDP;
        }
        next();
      },
      passport.authenticate('oidcStrategy')
    );

    router.use(
      '/callback',
      function(req, res, next) {
        next();
      },
      passport.authenticate('oidcStrategy'),
      function(req, res) {
        const redirectTo = req.session.redirectTo || '/';
        delete req.session.redirectTo;
        res.redirect(redirectTo);
      }
    );
  })
  .catch(err => {
    winstonLogger.error(`Error in Issuer.discover: ${err.message}`);
  });

module.exports = router;
