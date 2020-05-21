const express = require('express');
const router = express.Router();
const config = require('../config.json');
const fs = require('fs');

const configureRouter = async () => {
  console.log('Generating the landing page router');

  config.pages.forEach(landing => {
    const potentialPathToRouteFile = `${__dirname}/${landing.view}.js`;
    if (fs.existsSync(potentialPathToRouteFile)) {
      console.log(
        `Found a custom route file! Adding a custom route ${potentialPathToRouteFile} for ${landing.route}`
      );
      const routeFunction = require(potentialPathToRouteFile);
      router.get(landing.route, routeFunction);
    } else {
      console.log('Adding default route for', landing.route);
      router.get(landing.route, (req, res) => {
        res.render(landing.view, { docs: config.docs });
      });
    }
  });
};

configureRouter();

module.exports = router;
