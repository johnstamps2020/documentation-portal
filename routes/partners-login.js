var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var saml = require('passport-saml');

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const partnersSamlStrategy = new saml.Strategy(
  {
    path: '/partners-login/callback',
    entryPoint:
      'https://dev-guidewire.cs123.force.com/partners/idp/endpoint/HttpRedirect',
    issuer: 'https://partner.guidewire.com',
    cert:
      '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',
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    validateInResponseTo: true,
  },
  function(profile, done) {
    return done(null, profile);
  }
);

passport.use('partnersSamlStrategy', partnersSamlStrategy);
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
  passport.authenticate('partnersSamlStrategy')
);

router.post(
  '/callback',
  function(req, res, next) {
    console.log('-----------------------------');
    console.log('/Start login callback ');
    next();
  },
  passport.authenticate('partnersSamlStrategy'),
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
