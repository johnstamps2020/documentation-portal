var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var saml = require('passport-saml');

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const customersSamlStrategy = new saml.Strategy(
  {
    callbackUrl: `${process.env.APP_BASE_URL}` + '/customers-login/callback',
    entryPoint: `${process.env.CUSTOMERS_LOGIN_URL}`,
    issuer: `${process.env.CUSTOMERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID}`,
    cert: `${process.env.CUSTOMERS_LOGIN_CERT}`,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
    validateInResponseTo: true,
  },
  function(profile, done) {
    return done(null, profile);
  }
);

passport.use('customersSamlStrategy', customersSamlStrategy);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
router.use(passport.initialize({}));
router.use(passport.session({}));

/* GET home page. */
router.get(
  '/',
  function(req, res, next) {
    console.log('----------------------');
    console.log('/Start login handler');
    next();
  },
  passport.authenticate('customersSamlStrategy')
);

router.post(
  '/callback',
  function(req, res, next) {
    console.log('-----------------------------');
    console.log('/Start login callback ');
    next();
  },
  passport.authenticate('customersSamlStrategy'),
  function(req, res) {
    console.log('-----------------------------');
    console.log('Login call back dumps');
    console.log(req.user);
    console.log('-----------------------------');
    console.log('Login callback success');
    res.redirect('/');
  }
);

module.exports = router;
