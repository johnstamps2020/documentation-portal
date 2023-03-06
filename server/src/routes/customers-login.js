const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const saml = require('passport-saml');
const {
  openRequestedUrl,
  resolveRequestedUrl,
  saveRedirectUrlToSession,
} = require('../controllers/authController');

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const customersSamlStrategy = new saml.Strategy(
  {
    callbackUrl:
      `${process.env.CUSTOMERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID}` + '/callback',
    entryPoint: `${process.env.CUSTOMERS_LOGIN_URL}`,
    issuer: `${process.env.CUSTOMERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID}`,
    cert: `${process.env.CUSTOMERS_LOGIN_CERT}`,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
    validateInResponseTo: false,
  },
  function (profile, done) {
    return done(null, profile);
  }
);

passport.use('customersSamlStrategy', customersSamlStrategy);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
router.use(passport.initialize({}));
router.use(passport.session({}));

/* GET home page. */
router.get(
  '/',
  function (req, res, next) {
    saveRedirectUrlToSession(req);
    next();
  },
  passport.authenticate('customersSamlStrategy')
);

router.post(
  '/callback',
  function (req, res, next) {
    next();
  },
  passport.authenticate('customersSamlStrategy'),
  function (req, res) {
    res.redirect(resolveRequestedUrl(req));
  }
);

module.exports = router;
