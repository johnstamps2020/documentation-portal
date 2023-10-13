import OktaJwtVerifier from '@okta/jwt-verifier';
import { NextFunction, Request, Response } from 'express';
import { decode, JwtPayload } from 'jsonwebtoken';
import { winstonLogger } from './loggerController';
import { getUserInfo } from './userController';
import { ApiResponse } from '../types/apiResponse';

export async function saveUserInfoToResLocals(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.userInfo = await getUserInfo(req);
  return next();
}

export async function isAllowedToAccessRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userInfo = res.locals.userInfo;
  if (!userInfo.isLoggedIn) {
    return res.status(401).json({
      message: 'Route not available: User not logged in',
    });
  }
  return next();
}

export async function isAllowedToAccessRestrictedRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userInfo = res.locals.userInfo;
  if (!userInfo.isLoggedIn) {
    return res.status(401).json({
      message: 'Resource not available: User not logged in',
    });
  }
  if (!userInfo.isAdmin) {
    return res.status(403).json({
      message: 'Resource not available: Only GW admins can manage resources',
    });
  }
  return next();
}

export function isUserAllowedToAccessResource(
  res: Response,
  resourceIsPublic: boolean,
  resourceIsInternal: boolean,
  resourceIsInProduction: boolean
): ApiResponse {
  const isProductionEnvironment = process.env.DEPLOY_ENV === 'omega2-andromeda';
  if (isProductionEnvironment && !resourceIsInProduction) {
    return {
      status: 406,
      body: {
        message: 'Resource not available for this deployment environment',
      },
    };
  }
  if (resourceIsPublic) {
    return {
      status: 200,
      body: {
        message: 'Resource available: Public resource',
      },
    };
  }
  const userInfo = res.locals.userInfo;
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
              ERROR: ${err}`
    );
    return null;
  }
}

type AvailableOktaIssuers = {
  [x: string]: string | undefined;
};

function getAvailableOktaIssuers(): AvailableOktaIssuers {
  const issuers = {
    [process.env.OKTA_ISSUER as string]: process.env.OKTA_CLIENT_ID,
  };
  if (process.env.OKTA_ISSUER_APAC && process.env.OKTA_CLIENT_ID_APAC) {
    issuers[process.env.OKTA_ISSUER_APAC] = process.env.OKTA_CLIENT_ID_APAC;
  }
  if (process.env.OKTA_ISSUER_EMEA && process.env.OKTA_CLIENT_ID_EMEA) {
    issuers[process.env.OKTA_ISSUER_EMEA] = process.env.OKTA_CLIENT_ID_EMEA;
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
        (iss) => iss[0] === jwtIssuer
      );
      return new OktaJwtVerifier({
        issuer: issuer![0],
        clientId: issuer![1],
        assertClaims: {
          'scp.includes': process.env.OKTA_SCOPES,
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
              ERROR: ${err}`
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
      process.env.OKTA_AUDIENCE as string
    );
    return jwt;
  } catch (err) {
    winstonLogger.error(`${err}: ${err}`);
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
        req.accessToken = verifiedToken
          ? decode(verifiedToken.toString(), {})
          : null;
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
    winstonLogger.error(err);
    return null;
  }
}

export async function isLoggedInOrHasValidToken(req: Request) {
  try {
    const requestIsAuthenticated = req.isAuthenticated
      ? req.isAuthenticated()
      : false;
    return requestIsAuthenticated || !!(await verifyToken(req));
  } catch (err) {
    winstonLogger.error(`PROBLEM VERIFYING TOKEN: ${err}`);
    return false;
  }
}

export function saveRedirectUrlToSession(req: Request) {
  const redirectToParam = req.query.redirectTo;
  if (redirectToParam) {
    req.session!.redirectTo = redirectToParam;
  }
}

export function redirectToLoginPage(req: Request, res: Response) {
  try {
    const redirectTo = req.originalUrl;
    if (req.query.authSource === 'guidewire-customer') {
      return res.redirect(`/customers-login?redirectTo=${redirectTo}`);
    }
    if (req.query.authSource === 'guidewire-partner') {
      return res.redirect(`/partners-login?redirectTo=${redirectTo}`);
    }
    return res.redirect(`/gw-login?redirectTo=${redirectTo}`);
  } catch (err) {
    winstonLogger.error(
      `Problem redirecting to login page 
          ERROR: ${err}`
    );
  }
}

export function removeAuthParamsFromUrl(originalUrl: string) {
  const fullRequestUrl = new URL(originalUrl, process.env.APP_BASE_URL);
  if (fullRequestUrl.searchParams.has('authSource')) {
    fullRequestUrl.searchParams.delete('authSource');
    return fullRequestUrl.href.replace(`${process.env.APP_BASE_URL}`, '');
  }
  return originalUrl;
}

export function resolveRequestedUrl(req: Request) {
  if (req.session!.redirectTo) {
    const redirectTo = req.session!.redirectTo;
    delete req.session!.redirectTo;
    return redirectTo;
  }
  return '/';
}

export function openRequestedUrl(req: Request, res: Response) {
  try {
    const originalUrl = req.originalUrl;
    const cleanUrl = removeAuthParamsFromUrl(originalUrl);
    if (originalUrl !== cleanUrl) {
      return res.redirect(cleanUrl);
    }
  } catch (err) {
    winstonLogger.error(
      `Problem opening requested page 
          ERROR: ${err}`
    );
  }
}
