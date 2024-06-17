import OktaJwtVerifier from '@okta/jwt-verifier';
import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ApiResponse } from '../types/apiResponse';
import { winstonLogger } from './loggerController';
import { getUserInfo } from './userController';

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

export function getTokenFromRequestHeader(req: Request): string | null {
  try {
    const authorizationHeader = req.headers?.authorization;

    if (!authorizationHeader) {
      return null;
    }

    const [fieldName, authorizationHeaderValue] =
      authorizationHeader.split(' ');

    if (fieldName !== 'Bearer') {
      return null;
    }

    if (!authorizationHeaderValue) {
      return null;
    }

    return authorizationHeaderValue;
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

export function getAvailableOktaIssuers(): AvailableOktaIssuers {
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

export function createOktaJwtVerifier(
  token: JwtPayload,
  availableIssuers: AvailableOktaIssuers,
  requestedUrl: string,
  requestIp: string
): OktaJwtVerifier | null {
  try {
    const jwtIssuer = token.iss;
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
  } catch (err) {
    winstonLogger.error(
      `Problem creating OKTA JWT verifier, Requested URL: ${requestedUrl}, From IP: ${requestIp}, ERROR: ${err}`
    );
    return null;
  }
}

export function isUserLoggedIn(req: Request): boolean {
  try {
    const requestIsAuthenticated = req.isAuthenticated
      ? req.isAuthenticated()
      : false;
    return requestIsAuthenticated;
  } catch (err) {
    winstonLogger.error(
      `Problem verifying auth status, Requested URL: ${req.originalUrl}, From IP: ${req.ip}, ERROR: ${err}`
    );
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
