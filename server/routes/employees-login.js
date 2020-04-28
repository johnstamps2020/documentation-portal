require('dotenv').config;
const express = require('express');
const router = express.Router();

let gwUrl = new URL(`${process.env.OKTA_DOMAIN}/oauth2/v1/authorize`);
gwUrl.searchParams.set('idp', '0oa25tk18zhGOqMfj357');
gwUrl.searchParams.set('client_id', process.env.OKTA_CLIENT_ID);
gwUrl.searchParams.set('scope', encodeURIComponent('openid profile'));
gwUrl.searchParams.set('response_type', 'code');
gwUrl.searchParams.set('response_mode', 'fragment');
gwUrl.searchParams.set(
  'redirect_uri',
  encodeURIComponent(`${process.env.APP_BASE_URL}/authorization-code/callback`)
);
gwUrl.searchParams.set('state', 'WM6D');
gwUrl.searchParams.set('nonce', 'YsG76jo');

router.get('/', function(req, res, next) {
  console.log('WE WILL REDIRECT TO', gwUrl);
  res.redirect(gwUrl);
});

module.exports = router;
