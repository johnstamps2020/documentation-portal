require('dotenv').config();
const { ExpressOIDC } = require('@okta/oidc-middleware');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const { isPublicDoc } = require('../controllers/configController');

const loginGatewayRoute = '/gw-login';
const gwCommunityCustomerParam = 'guidewire-customer';
const gwCommunityPartnerParam = 'guidewire-partner';

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `${process.env.OKTA_DOMAIN}/oauth2/${process.env.OKTA_APP_ID}`,
  clientId: process.env.OKTA_CLIENT_ID,
  assertClaims: {
    'scp.includes': [process.env.OKTA_ACCESS_TOKEN_SCOPE],
  },
});

async function verifyToken(req) {
  try {
    const bearerHeader = req.headers?.authorization;
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const jwt = await oktaJwtVerifier.verifyAccessToken(
        bearerToken,
        'Guidewire'
      );
      return jwt;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

const oktaOIDC = new ExpressOIDC({
  issuer: `${process.env.OKTA_DOMAIN}`,
  client_id: `${process.env.OKTA_CLIENT_ID}`,
  client_secret: `${process.env.OKTA_CLIENT_SECRET}`,
  appBaseUrl: `${process.env.APP_BASE_URL}`,
  scope: 'openid profile',
});

const majorOpenRoutes = [
  '/404',
  '/unauthorized',
  '/product',
  '/alive',
  '/userInformation',
  '/safeConfig',
  '/developerResources',
];

const authGateway = async (req, res, next) => {
  try {
    const reqUrl = req.url;

    function redirectToLoginPage() {
      req.session.redirectTo = req.path;
      if (req.query.authSource === gwCommunityCustomerParam) {
        res.redirect('/customers-login');
      } else if (req.query.authSource === gwCommunityPartnerParam) {
        res.redirect('/partners-login');
      } else {
        res.redirect(loginGatewayRoute);
      }
    }

    function openRequestedPage() {
      if (req.query.authSource) {
        const fullRequestUrl = new URL(reqUrl, process.env.APP_BASE_URL);
        fullRequestUrl.searchParams.delete('authSource');
        res.redirect(fullRequestUrl.href);
      }
      if (req.session.redirectTo) {
        const redirectTo = req.session.redirectTo;
        delete req.session.redirectTo;
        res.redirect(redirectTo);
      } else {
        next();
      }
    }

    function openPublicPage() {
      req.next();
    }

    async function checkIfRouteIsOpen(pathname) {
      if (majorOpenRoutes.some(r => pathname.startsWith(r))) {
        return true;
      }

      const isPublicInConfig = await isPublicDoc(reqUrl);
      return isPublicInConfig === true;
    }

    const publicDocsAllowed = process.env.ALLOW_PUBLIC_DOCS === 'yes';
    const requestIsAuthenticated = !!(
      req.isAuthenticated() || (await verifyToken(req))
    );
    const authenticationEnabled = process.env.ENABLE_AUTH === 'yes';
    const isOpenRoute = await checkIfRouteIsOpen(reqUrl);

    if (!authenticationEnabled) {
      openRequestedPage();
    } else if (authenticationEnabled && requestIsAuthenticated) {
      openRequestedPage();
    } else if (authenticationEnabled && publicDocsAllowed && isOpenRoute) {
      openPublicPage();
    } else {
      redirectToLoginPage();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { oktaOIDC, authGateway, loginGatewayRoute };
