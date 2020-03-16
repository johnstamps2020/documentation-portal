require('dotenv').config();
var express = require('express');
var router = express.Router();
const axios = require('axios');

const configureRouter = async () => {
  console.log('Generating the landing page router');
  const configResponse = await axios.get(
    `${process.env.DOC_S3_URL}/config.json`
  );
  const config = configResponse.data;

  config.forEach(landing => {
    console.log('adding route', landing.route);
    router.get(landing.route, (req, res) => {
      res.render(landing.view, {docPackages: landing.docPackages});
    });
  });
};

configureRouter();

module.exports = router;
