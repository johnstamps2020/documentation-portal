var express = require('express');
var router = express.Router();
var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
  passport.use(
    new SamlStrategy(
      {
        path: '/login/callback',
        entryPoint:
          'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
        issuer: 'passport-saml',
      },
      function(profile, done) {
        findByEmail(profile.email, function(err, user) {
          if (err) {
            return done(err);
          }
          return done(null, user);
        });
      }
    )
  );
});

module.exports = router;
