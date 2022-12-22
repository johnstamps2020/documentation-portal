import OktaJwtVerifier from '@okta/jwt-verifier';
import { NextFunction, Request, Response } from 'express';
import { decode, JwtPayload } from 'jsonwebtoken';
import { isInternalDoc, isPublicDoc } from './configController';
import { addCommonDataToSessionLocals } from './localsController';
import { winstonLogger } from './loggerController';
import { getUserInfo } from './userController';

export const loginGatewayRoute = '/landing/gw-login';
export const forbiddenRoute = '/landing/forbidden';
const gwCommunityCustomerParam = 'guidewire-customer';
const gwCommunityPartnerParam = 'guidewire-partner';

export async function isUserAllowedToAccessResource(
  req: Request,
  resourceIsPublic: boolean,
  resourceIsInternal: boolean
): Promise<{ status: number; body: { message: string } }> {
  if (resourceIsPublic) {
    return {
      status: 200,
      body: {
        message: 'Resource available: Public resource',
      },
    };
  }
  const userInfo = await getUserInfo(req);
  if (!userInfo.isLoggedIn) {
    return {
      status: 401,
      body: {
        message: 'Resource not available: User not logged in',
      },
    };
  }
  if (resourceIsInternal) {
    return userInfo.hasGuidewireEmail
      ? {
          status: 200,
          body: {
            message: 'Resource available: GW user and internal resource',
          },
        }
      : {
          status: 403,
          body: {
            message:
              'Resource not available: Only GW users have access to internal resources',
          },
        };
  }
  return {
    status: 200,
    body: {
      message:
        'Resource available: User logged in, resource not internal and not public',
    },
  };
}

function getTokenFromRequestHeader(req: Request) {
  try {
    const authorizationHeader = req.headers?.authorization;
    return authorizationHeader ? authorizationHeader.split(' ')[1] : null;
  } catch (err) {
    winstonLogger.error(
      `Problem getting token from request header 
              ERROR: ${JSON.stringify(err)}`
    );
    return null;
  }
}

type AvailableOktaIssuers = {
  [x: string]: string | undefined;
};

function getAvailableOktaIssuers(): AvailableOktaIssuers {
  const issuers = {
    [process.env.OKTA_ACCESS_TOKEN_ISSUER as string]: process.env
      .OKTA_CLIENT_ID,
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

function createOktaJwtVerifier(
  token: string,
  availableIssuers: AvailableOktaIssuers
): OktaJwtVerifier | null {
  try {
    const decodedJwt = decode(token, {}) as JwtPayload;
    if (decodedJwt) {
      const jwtIssuer = decodedJwt.iss;
      const issuer = Object.entries(availableIssuers).find(
        iss => iss[0] === jwtIssuer
      );
      return new OktaJwtVerifier({
        issuer: issuer![0],
        clientId: issuer![1],
        assertClaims: {
          'scp.includes': process.env.OKTA_ACCESS_TOKEN_SCOPES,
        },
      });
    } else {
      winstonLogger.warning(
        'Invalid JSON Web Token in the Authorization header'
      );
      return null;
    }
  } catch (err) {
    winstonLogger.error(
      `Problem creating OKTA JWT verifier 
              ERROR: ${JSON.stringify(err)}`
    );
    return null;
  }
}

async function checkTokenInOkta(
  token: any,
  jwtVerifierInstance: OktaJwtVerifier
) {
  try {
    const jwt = await jwtVerifierInstance.verifyAccessToken(
      token,
      process.env.OKTA_ACCESS_TOKEN_AUDIENCE as string
    );
    return jwt;
  } catch (err) {
    winstonLogger.error(`${err}: ${JSON.stringify(err)}`);
    return null;
  }
}

async function verifyToken(req: Request) {
  try {
    const bearerToken = getTokenFromRequestHeader(req);
    if (bearerToken) {
      const oktaIssuers = getAvailableOktaIssuers();
      const oktaJwtVerifier = createOktaJwtVerifier(bearerToken, oktaIssuers);
      if (oktaJwtVerifier) {
        const verifiedToken = await checkTokenInOkta(
          bearerToken,
          oktaJwtVerifier
        );
        return verifiedToken;
      } else {
        return oktaJwtVerifier;
      }
    } else {
      winstonLogger.info(
        'The request does not contain the "Authorization: Bearer" header.'
      );
      return null;
    }
  } catch (err) {
    winstonLogger.error(JSON.stringify(err));
    return null;
  }
}

export async function isLoggedInOrHasValidToken(req: Request) {
  try {
    const rawJsonRequest = req.query.rawJSON === 'true';
    const requestIsAuthenticated = req.isAuthenticated
      ? req.isAuthenticated()
      : false;
    if (rawJsonRequest) {
      return requestIsAuthenticated || !!(await verifyToken(req));
    }
    return requestIsAuthenticated;
  } catch (err) {
    winstonLogger.error(`PROBLEM VERIFYING TOKEN: ${JSON.stringify(err)}`);
    return false;
  }
}

const majorPublicRoutes = [
  '/landing/404',
  '/landing/unauthorized',
  '/landing/error',
  '/product',
  '/alive',
  '/userInformation',
  '/safeConfig',
  '/landing/search',
  '/landing/apiReferences',
  '/recommendations',
  '/scripts',
  //  DO NOT DELETE google6a1282aff702e827.html, this allows us
  //  to use Google Search Console and needs to be always available!!!
  '/google6a1282aff702e827.html',
];

const majorInternalRoutes: string[] = [];

function redirectToLoginPage(req: Request, res: Response) {
  try {
    req.session!.redirectTo = req.url;
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
          ERROR: ${JSON.stringify(err)}`
    );
  }
}

function openRequestedPage(req: Request, res: Response, next: NextFunction) {
  try {
    let targetUrl = req.url;
    if (req.session!.redirectTo) {
      const redirectTo = req.session!.redirectTo;
      delete req.session!.redirectTo;
      targetUrl = redirectTo;
    }
    if (req.query.authSource) {
      const fullRequestUrl = new URL(targetUrl, process.env.APP_BASE_URL);
      fullRequestUrl.searchParams.delete('authSource');
      targetUrl = fullRequestUrl.href;
    }
    if (targetUrl !== req.url) {
      res.redirect(targetUrl);
    } else {
      next();
    }
  } catch (err) {
    winstonLogger.error(
      `Problem opening requested page 
          ERROR: ${JSON.stringify(err)}`
    );
  }
}

function openPublicPage(req: Request, next: NextFunction) {
  try {
    if (req.next) {
      req.next();
    } else {
      next();
    }
  } catch (err) {
    winstonLogger.error(
      `Problem opening public page 
          ERROR: ${JSON.stringify(err)}`
    );
  }
}

async function checkIfRouteIsPublic(req: Request) {
  const reqUrl = req.url;
  try {
    if (majorPublicRoutes.some(r => reqUrl.startsWith(r))) {
      return true;
    }

    const isPublicInConfig = await isPublicDoc(reqUrl);
    return isPublicInConfig === true;
  } catch (err) {
    winstonLogger.error(
      `Problem checking if route is open 
          ERROR: ${JSON.stringify(err)}`
    );
  }
}

async function checkIfRouteIsInternal(req: Request) {
  try {
    if (majorInternalRoutes.some(r => req.url.startsWith(r))) {
      return true;
    }
  } catch (err) {
    winstonLogger.error(
      `Problem checking if route in the list of internal routes internal 
          ERROR: ${JSON.stringify(err)}`
    );
  }

  try {
    const isInternalInConfig = await isInternalDoc(req.url);
    if (isInternalInConfig) {
      return true;
    }
  } catch (err) {
    winstonLogger.error(
      `Problem checking if route is an internal doc 
          ERROR: ${JSON.stringify(err)}`
    );
  }

  return false;
}

export const authGateway = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const publicDocsAllowed = process.env.ALLOW_PUBLIC_DOCS === 'yes';
    const authenticationIsDisabled = process.env.ENABLE_AUTH === 'no';

    const loggedInOrHasValidToken = await isLoggedInOrHasValidToken(req);
    const requestIsAuthenticated =
      authenticationIsDisabled || loggedInOrHasValidToken;
    req.session!.requestIsAuthenticated = requestIsAuthenticated;
    await addCommonDataToSessionLocals(req, res);
    const isOpenRoute = await checkIfRouteIsPublic(req);
    const isInternalRoute = await checkIfRouteIsInternal(req);
    const hasGuidewireEmail = res.locals.userInfo.hasGuidewireEmail;

    if (requestIsAuthenticated && !isInternalRoute) {
      openRequestedPage(req, res, next);
    } else if (requestIsAuthenticated && isInternalRoute && hasGuidewireEmail) {
      openRequestedPage(req, res, next);
    } else if (
      requestIsAuthenticated &&
      isInternalRoute &&
      !hasGuidewireEmail
    ) {
      res.redirect('/internal');
    } else if (!requestIsAuthenticated && publicDocsAllowed && isOpenRoute) {
      openPublicPage(req, next);
    } else {
      redirectToLoginPage(req, res);
    }
  } catch (err) {
    next(err);
  }
};
