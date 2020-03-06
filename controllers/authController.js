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
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect(loginGatewayRoute);
  }
};

module.exports = { oktaOIDC, authGateway, loginGatewayRoute };
