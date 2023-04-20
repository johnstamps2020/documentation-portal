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

const router = Router();

fetch(`${process.env.OKTA_ISSUER!}/.well-known/openid-configuration`)
  .then((r) => r.json())
  .then((oktaIssuerDetails) => {
    const oktaIssuer = new Issuer(oktaIssuerDetails);
    router.use(cookieParser());
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    const oktaClient = new oktaIssuer.Client({
      client_id: process.env.OKTA_CLIENT_ID!,
      client_secret: process.env.OKTA_CLIENT_SECRET,
      redirect_uris: [
        `${process.env.APP_BASE_URL}/authorization-code/callback`,
      ],
    });

    const oidcStrategy = new Strategy(
      {
        client: oktaClient,
        params: {
          scope: 'openid profile email',
        },
      },
      function (
        tokenSet: TokenSet,
        profile: UserinfoResponse,
        done: (err: any, user?: UserinfoResponse) => void
      ) {
        return done(null, { tokens: tokenSet, ...profile });
      }
    );
    passport.serializeUser(function (user, done) {
      done(null, user);
    });
    passport.deserializeUser(function (user: UserinfoResponse, done) {
      done(null, user);
    });
    passport.use('oidcStrategy', oidcStrategy);
    router.use(passport.initialize());
    router.use(passport.session());

    router.get(
      '/',
      function (req, res, next) {
        // @ts-ignore
        delete oidcStrategy._params.idp;
        if (req.query.idp === 'okta') {
          // @ts-ignore
          oidcStrategy._params.idp = process.env.OKTA_IDP;
        }
        saveRedirectUrlToSession(req);
        next();
      },
      passport.authenticate('oidcStrategy')
    );

    router.use(
      '/callback',
      function (req, res, next) {
        next();
      },
      passport.authenticate('oidcStrategy'),
      function (req, res) {
        res.redirect(resolveRequestedUrl(req));
      }
    );
  })
  .catch((err) => {
    winstonLogger.error(`Error in Issuer.discover: ${err}`);
  });

module.exports = router;
