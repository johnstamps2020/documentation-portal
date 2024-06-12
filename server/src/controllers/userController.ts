import 'dotenv/config';
import { Request } from 'express';
import {
  externalMockUserData,
  internalMockUserData,
} from './utils/mockUserData';

import { UserInfo } from '@doctools/components';
import { JwtPayload, decode } from 'jsonwebtoken';
import {
  createOktaJwtVerifier,
  getAvailableOktaIssuers,
  getTokenFromRequestHeader,
  isUserLoggedIn,
} from './authController';
import { winstonLogger } from './loggerController';

function belongsToGuidewire(email: string) {
  try {
    return !!email?.endsWith('@guidewire.com');
  } catch (err) {
    winstonLogger.error(
      `Problem checking if user belongs to Guidewire
          EMAIL: ${email}
          ERROR: ${JSON.stringify(err)}`
    );
    return false;
  }
}

export type ReqUser = {
  sub: string;
  name: string;
  email: string;
  locale: string;
  isAdmin: boolean;
  isPowerUser: boolean;
  groups: string[];
};

function getUserName(user: ReqUser) {
  if (user?.name) {
    return user.name;
  }

  if (user?.email) {
    return user.email.split('@')[0];
  }

  return 'Unnamed User';
}

function isAdminAccessToken(accessToken: JwtPayload) {
  const adminScopes = [
    'NODE_Hawaii_Docs_Web.admin',
    'Documentation_portal.admin',
  ];
  return adminScopes.some((s) => accessToken.scp.includes(s));
}

const unknownUserInfo: UserInfo = {
  isLoggedIn: false,
  name: 'Unknown',
  email: 'Unknown',
  preferred_username: 'Unknown',
  id: 'Unknown',
  hasGuidewireEmail: false,
  locale: 'en-US',
  isAdmin: false,
  isPowerUser: false,
};

export async function getUserInfo(req: Request): Promise<UserInfo> {
  const requestedUrl = req.originalUrl;
  const ipAddress: string = req.ip || 'undefined';
  try {
    if (process.env.ENABLE_AUTH === 'no') {
      if (process.env.PRETEND_TO_BE_EXTERNAL === 'yes') {
        return externalMockUserData;
      }
      return internalMockUserData;
    }
    const isLoggedIn = isUserLoggedIn(req);

    if (isLoggedIn) {
      const user = req.user;

      if (!user) {
        return { ...unknownUserInfo, isLoggedIn };
      }

      const email = user.email?.toLowerCase() || 'no email';

      return {
        isLoggedIn,
        name: getUserName(user),
        email: email,
        preferred_username: email,
        id: user.sub,
        hasGuidewireEmail: belongsToGuidewire(email),
        locale: user.locale,
        isAdmin: user.isAdmin,
        isPowerUser: user.isPowerUser,
      };
    }

    const tokenFromHeader = getTokenFromRequestHeader(req);
    if (!tokenFromHeader) {
      return unknownUserInfo;
    }

    const decodedToken = decode(tokenFromHeader, {}) as JwtPayload;
    if (decodedToken === null) {
      winstonLogger.warning(
        `Invalid JSON Web Token (JWT) in the authorization header, Requested URL: ${requestedUrl}, From IP: ${ipAddress}`
      );

      return unknownUserInfo;
    }

    const oktaIssuers = getAvailableOktaIssuers();
    const oktaJwtVerifier = createOktaJwtVerifier(
      decodedToken,
      oktaIssuers,
      requestedUrl,
      ipAddress
    );
    if (!oktaJwtVerifier) {
      return unknownUserInfo;
    }

    try {
      await oktaJwtVerifier.verifyAccessToken(
        tokenFromHeader,
        process.env.OKTA_AUDIENCE as string
      );
    } catch (oktaError) {
      winstonLogger.error(
        `Problem verifying access token in Okta; REQUESTED URL: ${requestedUrl}, FROM IP: ${ipAddress}, ERROR: ${oktaError}`
      );
      return unknownUserInfo;
    }

    const adminAccessToken = isAdminAccessToken(decodedToken);
    return {
      ...unknownUserInfo,
      isLoggedIn: true,
      // Only GW apps have access to the doc portal through JWT, but we don't know who logs into these apps
      // and if they are GW employees.
      // Therefore, only apps with admin access are treated as GW employees to limit access to internal resources.
      hasGuidewireEmail: adminAccessToken,
      isAdmin: adminAccessToken,
    };
  } catch (err) {
    winstonLogger.error(
      `Problem getting user info; REQUESTED URL: ${requestedUrl}, FROM IP: ${ipAddress}, ERROR: ${err}`
    );
    return unknownUserInfo;
  }
}
