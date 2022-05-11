require('dotenv').config();
const OktaJwtVerifier = require('@okta/jwt-verifier');
const jsonwebtoken = require('jsonwebtoken');
const { isPublicDoc, isInternalDoc } = require('./configController');
const { addCommonDataToSessionLocals } = require('./localsController');
const path = require('path');
const fs = require('fs');
const { winstonLogger } = require('./loggerController');
const staticPagesDir = path.join(__dirname, '..', 'static', 'pages');

const loginGatewayRoute = '/gw-login';
const gwCommunityCustomerParam = 'guidewire-customer';
const gwCommunityPartnerParam = 'guidewire-partner';

function getTokenFromRequestHeader(req) {
  try {
    const authorizationHeader = req.headers?.authorization;
    return authorizationHeader ? authorizationHeader.split(' ')[1] : null;
  } catch (err) {
    winstonLogger.error(
          `Problem getting token from request header 
              ERROR: ${err.message}`
        );
  }
}

function getAvailableOktaIssuers() {
  const issuers = {
    [process.env.OKTA_ACCESS_TOKEN_ISSUER]: process.env.OKTA_CLIENT_ID,
  };
  if (
    process.env.OKTA_ACCESS_TOKEN_ISSUER_APAC &&
    process.env.OKTA_CLIENT_ID_APAC
  ) {
    issuers[process.env.OKTA_ACCESS_TOKEN_ISSUER_APAC] =
      process.env.OKTA_CLIENT_ID_APAC;
  }
  if (
    process.env.OKTA_ACCESS_TOKEN_ISSUER_EMEA &&
    process.env.OKTA_CLIENT_ID_EMEA
  ) {
    issuers[process.env.OKTA_ACCESS_TOKEN_ISSUER_EMEA] =
      process.env.OKTA_CLIENT_ID_EMEA;
  }

  return issuers;
}

function createOktaJwtVerifier(token, availableIssuers) {
  try {
    const decodedJwt = jsonwebtoken.decode(token, {});
    if (decodedJwt) {
      const jwtIssuer = decodedJwt.iss;
      const issuer = Object.entries(availableIssuers).find(
        iss => iss[0] === jwtIssuer
      );
      return new OktaJwtVerifier({
        issuer: issuer[0],
        clientId: issuer[1],
        assertClaims: {
          'scp.includes': process.env.OKTA_ACCESS_TOKEN_SCOPES,
        },
      });
    } else {
      throw new Error('Invalid JSON Web Token in the Authorization header.');
    }
  } catch (err) {
    winstonLogger.error(
          `Problem creating OKTA JWT verifier 
              ERROR: ${err.message}`
        );
  }
}

async function checkTokenInOkta(token, jwtVerifierInstance) {
  try {
    const jwt = await jwtVerifierInstance.verifyAccessToken(
      token,
      process.env.OKTA_ACCESS_TOKEN_AUDIENCE
    );
    return jwt;
  } catch (err) {
    throw new Error(`${err.name}: ${err.userMessage}`);
  }
}

async function verifyToken(req) {
  try {
    const bearerToken = getTokenFromRequestHeader(req);
    if (bearerToken) {
      const oktaIssuers = getAvailableOktaIssuers();
      const oktaJwtVerifier = createOktaJwtVerifier(bearerToken, oktaIssuers);
      const verifiedToken = await checkTokenInOkta(
        bearerToken,
        oktaJwtVerifier
      );
      return verifiedToken;
    } else {
      winstonLogger.info(
        'The request does not contain the "Authorization: Bearer" header.'
      );
      return null;
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function isLoggedInOrHasValidToken(req) {
  try {
    const rawJsonRequest = req.query.rawJSON === 'true';
    return rawJsonRequest
      ? !!(req.isAuthenticated() || (await verifyToken(req)))
      : !!req.isAuthenticated();
  } catch (err) {
    winstonLogger.error(err.stack);
    return false;
  }
}

const majorOpenRoutes = [
  '/404',
  '/unauthorized',
  '/product',
  '/alive',
  '/userInformation',
  '/safeConfig',
  '/search',
  '/apiReferences',
  '/recommendations',
];

const majorInternalRoutes = [];

const authGateway = async (req, res, next) => {
  try {
    const reqUrl = req.url;

    function redirectToLoginPage() {
      try {
        req.session.redirectTo = reqUrl;
        if (req.query.authSource === gwCommunityCustomerParam) {
          res.redirect('/customers-login');
        } else if (req.query.authSource === gwCommunityPartnerParam) {
          res.redirect('/partners-login');
        } else {
          res.redirect(loginGatewayRoute);
        }
      } catch (err) {
        winstonLogger.error(
          `Problem redirecting to login page 
              ERROR: ${err.message}`
        );
      }
    }

    function openRequestedPage() {
      try {
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
      } catch (err) {
        winstonLogger.error(
          `Problem opening requested page 
              ERROR: ${err.message}`
        );
      }
    }

    function openPublicPage() {
      try {
        req.next();
      } catch (err) {
        winstonLogger.error(
          `Problem opening public page 
              ERROR: ${err.message}`
        );
      }
    }

    async function checkIfRouteIsOpen() {
      try {
        if (majorOpenRoutes.some(r => reqUrl.startsWith(r))) {
          return true;
        }

        const isPublicInConfig = await isPublicDoc(reqUrl, req);
        return isPublicInConfig === true;
      } catch (err) {
        winstonLogger.error(
          `Problem checking if route is open 
              ERROR: ${err.message}`
        );
      }
    }

    async function checkIfRouteIsInternal() {
      try {
        if (majorInternalRoutes.some(r => reqUrl.startsWith(r))) {
          return true;
        }

        const configFilePath = decodeURI(
          path.join(staticPagesDir, req.path, 'index.json')
        );
        const configFileExists = fs.existsSync(configFilePath);
        if (configFileExists) {
          const fileContents = fs.readFileSync(configFilePath, 'utf-8');
          const fileContentsJson = JSON.parse(fileContents);
          return fileContentsJson.internal;
        }
        const isInternalInConfig = await isInternalDoc(reqUrl, req);
        return isInternalInConfig === true;
      } catch (err) {
        winstonLogger.error(
          `Problem checking if route is internal 
              ERROR: ${err.message}`
        );
      }
    }

    const publicDocsAllowed = process.env.ALLOW_PUBLIC_DOCS === 'yes';
    const authenticationIsDisabled = process.env.ENABLE_AUTH === 'no';
    
    const loggedInOrHasValidToken = await isLoggedInOrHasValidToken(req);
    const requestIsAuthenticated =
      authenticationIsDisabled || loggedInOrHasValidToken;
    req.session.requestIsAuthenticated = requestIsAuthenticated;
    addCommonDataToSessionLocals(req, res);
    const isOpenRoute = await checkIfRouteIsOpen();
    const isInternalRoute = await checkIfRouteIsInternal();
    const hasGuidewireEmail = res.locals.userInfo.hasGuidewireEmail;

    if (requestIsAuthenticated && !isInternalRoute) {
      openRequestedPage();
    } else if (requestIsAuthenticated && isInternalRoute && hasGuidewireEmail) {
      openRequestedPage();
    } else if (
      requestIsAuthenticated &&
      isInternalRoute &&
      !hasGuidewireEmail
    ) {
      res.redirect('/internal');
    } else if (!requestIsAuthenticated && publicDocsAllowed && isOpenRoute) {
      openPublicPage();
    } else {
      redirectToLoginPage();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authGateway,
  loginGatewayRoute,
};
