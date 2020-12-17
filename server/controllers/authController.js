require('dotenv').config();
const { ExpressOIDC } = require('@okta/oidc-middleware');
const { isPublicDoc } = require('../controllers/configController');

const loginGatewayRoute = '/gw-login';

const gwCommunityCustomerParam = 'guidewire-customer';
const gwCommunityPartnerParam = 'guidewire-partner';

const oktaOIDC = new ExpressOIDC({
  issuer: `${process.env.OKTA_DOMAIN}`,
  client_id: `${process.env.OKTA_CLIENT_ID}`,
  client_secret: `${process.env.OKTA_CLIENT_SECRET}`,
  appBaseUrl: `${process.env.APP_BASE_URL}`,
  scope: 'openid profile',
});

const majorOpenRoutes = [
  '/cloudProducts',
  '/selfManagedProducts',
  '/404',
  '/unauthorized',
  '/product',
  '/alive',
  '/userInformation',
  '/search',
  '/config',
];

const authGateway = async (req, res, next) => {
  try {
    const reqUrl = new URL(req.url, 'relative:///');
    const isPublic = await isPublicDoc(reqUrl.pathname);
    if (
      req.isAuthenticated() ||
      process.env.ENABLE_AUTH === 'no' ||
      reqUrl.pathname === '/' ||
      majorOpenRoutes.some(r => reqUrl.pathname.startsWith(r)) ||
      isPublic
    ) {
      if (req.query.authSource) {
        res.redirect(reqUrl.pathname);
      }
      if (req.session.redirectTo) {
        const redirectTo = req.session.redirectTo;
        delete req.session.redirectTo;
        res.redirect(redirectTo);
      } else {
        next();
      }
    } else {
      req.session.redirectTo = req.path;
      if (req.query.authSource === gwCommunityCustomerParam) {
        res.redirect('/customers-login');
      } else if (req.query.authSource === gwCommunityPartnerParam) {
        res.redirect('/partners-login');
      } else {
        res.redirect(loginGatewayRoute);
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { oktaOIDC, authGateway, loginGatewayRoute };
