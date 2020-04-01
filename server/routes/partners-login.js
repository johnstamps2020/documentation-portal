const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const saml = require('passport-saml');

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const partnersSamlStrategy = new saml.Strategy(
  {
    callbackUrl:
      `${process.env.PARTNERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID}` + '/callback',
    entryPoint: `${process.env.PARTNERS_LOGIN_URL}`,
    issuer: `${process.env.PARTNERS_LOGIN_SERVICE_PROVIDER_ENTITY_ID}`,
    cert: `${process.env.PARTNERS_LOGIN_CERT}`,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
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

    const redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo;
    res.redirect(redirectTo);
  }
);

module.exports = router;
