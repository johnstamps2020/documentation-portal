import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { Router } from 'express';
import { Issuer, Strategy, TokenSet, UserinfoResponse } from 'openid-client';
import passport from 'passport';
import {
  resolveRequestedUrl,
  saveRedirectUrlToSession,
} from '../controllers/authController';
import { winstonLogger } from '../controllers/loggerController';
import { OktaInstance, OktaStrategy } from '../types/auth';

const router = Router();

const oktaInstanceAmer: OktaInstance = {
  region: 'amer',
  url: process.env.OKTA_ISSUER!,
  clientId: process.env.OKTA_CLIENT_ID!,
  clientSecret: process.env.OKTA_CLIENT_SECRET!,
};
const oktaIntanceApac: OktaInstance = {
  region: 'apac',
  url: process.env.OKTA_ISSUER_APAC!,
  clientId: process.env.OKTA_CLIENT_ID_APAC!,
  clientSecret: process.env.OKTA_CLIENT_SECRET_APAC!,
};

const oktaInstanceEmea: OktaInstance = {
  region: 'emea',
  url: process.env.OKTA_ISSUER_EMEA!,
  clientId: process.env.OKTA_CLIENT_ID_EMEA!,
  clientSecret: process.env.OKTA_CLIENT_SECRET_EMEA!,
};

function isAdminUser(userGroups: string[]) {
  const adminGroups = process.env.OKTA_ADMIN_GROUPS?.split(',') || [];
  return (
    adminGroups.length > 0 &&
    adminGroups.some((adminGroup) => userGroups.includes(adminGroup))
  );
}

function isPowerUser(userEmail: string | undefined) {
  if (!userEmail) {
    return false;
  }
  const powerUsers = process.env.POWER_USERS?.split(',') || [];
  return powerUsers.length > 0 && powerUsers.includes(userEmail);
}

async function createOktaStrategies() {
  const oktaScopes = 'openid profile email';
  const oktaRedirectUris = [
    `${process.env.APP_BASE_URL!}/authorization-code/callback`,
  ];

  const oktaInstances: OktaInstance[] =
    process.env.DEPLOY_ENV === 'omega2-andromeda'
      ? [oktaInstanceAmer, oktaIntanceApac, oktaInstanceEmea]
      : [oktaInstanceAmer];

  const oktaStrategies: OktaStrategy[] = [];
  for (const oktaInstance of oktaInstances) {
    const response = await fetch(
      `${oktaInstance.url}/.well-known/openid-configuration`
    );
    if (response.ok) {
      const oktaIssuerDetails = await response.json();
      const oktaIssuer = new Issuer(oktaIssuerDetails);
      const oktaClient = new oktaIssuer.Client({
        client_id: oktaInstance.clientId,
        client_secret: oktaInstance.clientSecret,
        redirect_uris: oktaRedirectUris,
      });
      const oidcStrategy = new Strategy(
        {
          client: oktaClient,
          params: {
            scope: oktaScopes,
          },
        },
        function (
          tokenSet: TokenSet,
          profile: UserinfoResponse,
          done: (err: any, user?: UserinfoResponse) => void
        ) {
          profile.isAdmin = isAdminUser(profile.groups as string[]);
          // Keeping info about groups in the user profile increases the size of the session cookie significantly.
          // For some users, it was not possible to set the session cookie because it exceeded the maximum size
          // allowed by the browser (4096 bytes).
          delete profile.groups;
          profile.isPowerUser = isPowerUser(profile.email);
          return done(null, profile);
        }
      );
      oktaStrategies.push({
        region: oktaInstance.region,
        oidcStrategy: oidcStrategy,
      });
    }
  }
  return oktaStrategies;
}

createOktaStrategies()
  .then((oktaStrategies) => {
    router.use(cookieParser());
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    passport.serializeUser(function (user, done) {
      done(null, user);
    });
    passport.deserializeUser(function (user: UserinfoResponse, done) {
      done(null, user);
    });
    router.use(passport.initialize());
    router.use(passport.session());
    for (const oktaStrategy of oktaStrategies) {
      passport.use(oktaStrategy.region, oktaStrategy.oidcStrategy);
    }

    router.get('/', function (req, res, next) {
      const { region } = req.query;
      saveRedirectUrlToSession(req);
      const oidcStrategyName = region as string;
      req.session!.oidcStrategyName = oidcStrategyName;
      passport.authenticate(oidcStrategyName)(req, res, next);
    });

    router.use(
      '/callback',
      function (req, res, next) {
        const oidcStrategyName = req.session!.oidcStrategyName;
        delete req.session!.oidcStrategyName;
        passport.authenticate(oidcStrategyName)(req, res, next);
      },
      function (req, res) {
        res.redirect(resolveRequestedUrl(req));
      }
    );
  })
  .catch((err) => {
    winstonLogger.error(`Authentication error: ${err}`);
  });

module.exports = router;
