const express = require('express');
const router = express.Router();
const config = require('../config.json');


const configureRouter = async () => {
  console.log('Generating the landing page router');

  config.forEach(landing => {
    console.log('adding route', landing.route);
    router.get(landing.route, (req, res) => {
      res.render(landing.view, {docPackages: landing.docPackages});
    });
  });
};

configureRouter();

module.exports = router;
