const { Issuer, Strategy } = require('openid-client');
const express = require('express');
const router = express.Router();
const passport = require('passport');

Issuer.discover(process.env.OKTA_DOMAIN).then(oktaIssuer => {
  const oktaClient = new oktaIssuer.Client({
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uris: [`${process.env.APP_BASE_URL}/authorization-code/callback`],
  });

  const oidcStrategy = new Strategy(
    {
      client: oktaClient,
      params: {
        idp: '0oamwriqo1E1dOdd70h7',
        scope: 'openid profile',
      },
    },
    function(tokenSet, profile, done) {
      if (tokenSet) {
        return profile
          ? done(null, {
              profile,
              tokens: tokenSet,
            })
          : done(null, {
              tokens: tokenSet,
            });
      } else {
        return done(null);
      }
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
});

module.exports = router;
