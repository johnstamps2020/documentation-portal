import { Request } from 'express';
import { UserInfo } from '../types/user';
import {
  externalMockUserData,
  internalMockUserData,
} from './utils/mockUserData';

import { winstonLogger } from './loggerController';
import { isLoggedInOrHasValidToken } from './authController';
import { JwtPayload } from 'jsonwebtoken';

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
};

export async function getUserInfo(req: Request): Promise<UserInfo> {
  try {
    if (process.env.ENABLE_AUTH === 'no') {
      if (process.env.PRETEND_TO_BE_EXTERNAL === 'yes') {
        return externalMockUserData;
      }
      return internalMockUserData;
    }
    const isLoggedIn = await isLoggedInOrHasValidToken(req);
    const user = req.user;
    if (!user) {
      if (isLoggedIn) {
        const accessToken = req.accessToken as JwtPayload;
        const adminAccessToken = isAdminAccessToken(accessToken);
        return {
          ...unknownUserInfo,
          isLoggedIn: isLoggedIn,
          // Only GW apps have access to the doc portal through JWT, but we don't know who logs into these apps
          // and if they are GW employees.
          // Therefore, only apps with admin access are treated as GW employees to limit access to internal resources.
          hasGuidewireEmail: adminAccessToken,
          isAdmin: adminAccessToken,
        };
      }
      return unknownUserInfo;
    }
    const email = user.email?.toLowerCase() || 'no email';

    return {
      isLoggedIn: isLoggedIn,
      name: getUserName(user),
      email: email,
      preferred_username: email,
      id: user.sub,
      hasGuidewireEmail: belongsToGuidewire(email),
      locale: user.locale,
      isAdmin: user.isAdmin,
    };
  } catch (err) {
    winstonLogger.error(
      `Problem getting user info
          ERROR: ${err}`
    );
    return unknownUserInfo;
  }
}
