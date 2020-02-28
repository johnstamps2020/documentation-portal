var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var saml = require('passport-saml');
var fs = require('fs');

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const customersSamlStrategy = new saml.Strategy(
  {
    callbackUrl: 'http://localhost/customers-login/callback',
    entryPoint: 'http://localhost:9090/simplesaml/saml2/idp/SSOService.php',
    issuer: 'saml-poc',
    identifierFormat: null,
    decryptionPvk: fs.readFileSync(
      __dirname + '/../test_certs/key.pem',
      'utf8'
    ),
    privateCert: fs.readFileSync(__dirname + '/../test_certs/key.pem', 'utf8'),
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
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
    console.log('login call back dumps');
    console.log(req.user);
    console.log('-----------------------------');
    console.log('Log in Callback Success');
    res.redirect('/search');
  }
);

router.get('/metadata', function(req, res) {
  res.type('application/xml');
  res
    .status(200)
    .send(
      customersSamlStrategy.generateServiceProviderMetadata(
        fs.readFileSync(__dirname + '/../test_certs/cert.pem', 'utf8'),
        fs.readFileSync(__dirname + '/../test_certs/cert.pem', 'utf8')
      )
    );
});

module.exports = router;
