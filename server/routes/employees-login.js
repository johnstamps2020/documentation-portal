require('dotenv').config;
const express = require('express');
const router = express.Router();

let gwUrl = new URL(`${process.env.OKTA_DOMAIN}/oauth2/aus11vix3uKEpIfSI357/v1/authorize`);
gwUrl.searchParams.set('idp', process.env.OKTA_IDP);
gwUrl.searchParams.set('client_id', process.env.OKTA_CLIENT_ID);
gwUrl.searchParams.set('scope', 'openid profile');
gwUrl.searchParams.set('response_type', 'code');
gwUrl.searchParams.set(
  'redirect_uri',
  encodeURI(`${process.env.APP_BASE_URL}/authorization-code/callback`)
);
gwUrl.searchParams.set('state', 'WM6D');
gwUrl.searchParams.set('nonce', 'YsG76jo');

router.get('/', function(req, res, next) {
  res.redirect(gwUrl);
});

module.exports = router;
