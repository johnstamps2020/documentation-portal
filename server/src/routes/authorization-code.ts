import { Issuer, Strategy, TokenSet, UserinfoResponse } from 'openid-client';
import { Router } from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { winstonLogger } from '../controllers/loggerController';
import {
  resolveRequestedUrl,
  saveRedirectUrlToSession,
} from '../controllers/authController';
import fetch from 'node-fetch';
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

async function createOktaStrategies() {
  const oktaScopes = 'openid profile email';
  const oktaRedirectUris = [
    `${process.env.APP_BASE_URL!}/authorization-code/callback`,
  ];

  // FIXME: Strategies for EMEA and APAC are removed until we resolve the issue with conflicting Okta strategies
  const oktaInstances: OktaInstance[] =
    process.env.DEPLOY_ENV === 'omega2-andromeda'
      ? [oktaInstanceAmer]
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

    const oidcStrategyName: string = 'oidcStrategy';
    router.get(
      '/',
      function (req, res, next) {
        const { region } = req.query;
        const strategy =
          oktaStrategies.find((s) => s.region === region) || oktaStrategies[0];
        passport.use(oidcStrategyName, strategy.oidcStrategy);
        saveRedirectUrlToSession(req);
        next();
      },
      passport.authenticate(oidcStrategyName)
    );

    router.use(
      '/callback',
      function (req, res, next) {
        next();
      },
      passport.authenticate(oidcStrategyName),
      function (req, res) {
        res.redirect(resolveRequestedUrl(req));
      }
    );
  })
  .catch((err) => {
    winstonLogger.error(`Authentication error: ${err}`);
  });

module.exports = router;
