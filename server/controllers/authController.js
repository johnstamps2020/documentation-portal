require('dotenv').config();
const { ExpressOIDC } = require('@okta/oidc-middleware');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const jsonwebtoken = require('jsonwebtoken');
const { isPublicDoc } = require('../controllers/configController');

const loginGatewayRoute = '/gw-login';
const gwCommunityCustomerParam = 'guidewire-customer';
const gwCommunityPartnerParam = 'guidewire-partner';

function createOktaJwtVerifier(token) {
  const availableIssuers = {
    [process.env.OKTA_ACCESS_TOKEN_ISSUER]: process.env.OKTA_CLIENT_ID,
    [process.env.OKTA_ACCESS_TOKEN_ISSUER_APAC]:
      process.env.OKTA_CLIENT_ID_APAC,
    [process.env.OKTA_ACCESS_TOKEN_ISSUER_EMEA]:
      process.env.OKTA_CLIENT_ID_EMEA,
  };
  const decodedJwt = jsonwebtoken.decode(token);
  const jwtIssuer = decodedJwt.iss;
  const issuer = Object.entries(availableIssuers).find(
    iss => iss[0] === jwtIssuer
  );
  if (issuer) {
    return new OktaJwtVerifier({
      issuer: issuer[0],
      clientId: issuer[1],
      assertClaims: {
        'scp.includes': process.env.OKTA_ACCESS_TOKEN_SCOPES,
      },
    });
  } else {
    return new Error(`Unable to verify the token with issuer ${jwtIssuer}`);
  }
}

async function verifyToken(req) {
  try {
    const bearerHeader = req.headers?.authorization;
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const oktaJwtVerifier = createOktaJwtVerifier(bearerToken);
      const jwt = await oktaJwtVerifier.verifyAccessToken(
        bearerToken,
        process.env.OKTA_ACCESS_TOKEN_AUDIENCE
      );
      return jwt;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function isRequestAuthenticated(req) {
  return !!(req.isAuthenticated() || (await verifyToken(req)));
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
  '/search',
  '/developerResources',
];

const authGateway = async (req, res, next) => {
  try {
    const reqUrl = req.url;

    function redirectToLoginPage() {
      req.session.redirectTo = reqUrl;
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

      const isPublicInConfig = await isPublicDoc(reqUrl, req);
      return isPublicInConfig === true;
    }

    const publicDocsAllowed = process.env.ALLOW_PUBLIC_DOCS === 'yes';
    const requestIsAuthenticated = await isRequestAuthenticated(req);
    req.session.requestIsAuthenticated = requestIsAuthenticated;
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

module.exports = {
  oktaOIDC,
  authGateway,
  loginGatewayRoute,
  isRequestAuthenticated,
};
