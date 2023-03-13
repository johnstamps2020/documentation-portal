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
  name: string;
  email: string;
  locale: string;
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

function isAdminUser(user: ReqUser) {
  return [
    'mskowron@guidewire.com',
    'pkowaluk@guidewire.com',
    'mszeligiewicz@guidewire.com',
    'mgilster@guidewire.com',
  ].includes(user.email);
}

function isAdminAccessToken(accessToken: JwtPayload) {
  return accessToken.scp.includes('NODE_Hawaii_Docs_Web.admin');
}

const unknownUserInfo: UserInfo = {
  isLoggedIn: false,
  name: 'Unknown',
  email: 'Unknown',
  preferred_username: 'Unknown',
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
        return {
          ...unknownUserInfo,
          isLoggedIn: isLoggedIn,
          isAdmin: isAdminAccessToken(accessToken),
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
      hasGuidewireEmail: belongsToGuidewire(email),
      locale: user.locale,
      isAdmin: isAdminUser(user),
    };
  } catch (err) {
    winstonLogger.error(
      `Problem getting user info
          ERROR: ${err}`
    );
    return unknownUserInfo;
  }
}
