require('dotenv').config();
const { ExpressOIDC } = require('@okta/oidc-middleware');

const loginGatewayRoute = '/gw-login';

const oktaOIDC = new ExpressOIDC({
  issuer: `${process.env.OKTA_DOMAIN}`,
  client_id: `${process.env.OKTA_CLIENT_ID}`,
  client_secret: `${process.env.OKTA_CLIENT_SECRET}`,
  appBaseUrl: `${process.env.APP_BASE_URL}`,
  scope: 'openid profile',
});

const authGateway = (req, res, next) => {
  if (req.isAuthenticated() || process.env.DEV === 'yes') {
    if (req.session.redirectTo) {
      const redirectTo = req.session.redirectTo;
      delete req.session.redirectTo;
      res.redirect(redirectTo);
    } else {
      next();
    }
  } else {
    req.session.redirectTo = req.path;
    res.redirect(loginGatewayRoute);
  }
};

module.exports = { oktaOIDC, authGateway, loginGatewayRoute };
