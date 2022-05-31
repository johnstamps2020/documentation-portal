const { Router } = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const harmon = require('harmon');
const {
  tagManagerHeadScript,
  pendoInstallScript,
  tagManagerBody,
  getPendoInitializeScript,
} = require('../controllers/analyticsController');

function appendToSelectedItem(node, str) {
  try {
    const readStream = node.createReadStream();
    const writeStream = node.createWriteStream();

    // read, but do not end the stream
    readStream.pipe(writeStream, { end: false });

    // when the stream has ended, attach
    readStream.on('end', function() {
      writeStream.end(str);
    });
  } catch (err) {
    winstonLogger.error(`ERROR overwriting response using Harmon: 
          ERROR: ${err.message}`);
  }
}

const responseSelectors = [
  {
    query: 'head',
    func: function(node) {
      appendToSelectedItem(
        node,
        `
    <!-- Google tag manager -->
    <script>${tagManagerHeadScript}</script>
    <!-- Pendo install -->
    <script>${pendoInstallScript}</script>
    `
      );
    },
  },
];

const harmonRouter = Router();

harmonRouter.use(function(req, res, next) {
  if (responseSelectors.length === 1 && res.locals?.userInfo) {
    const pendoInitializeScript = getPendoInitializeScript(res.locals.userInfo);
    const pendoAndGoogleScripts = `
      <!-- Pendo initialize -->
      <script>${pendoInitializeScript}</script>
      <!-- Google tag manager no-script -->
      <noscript>${tagManagerBody}</noscript>`;
    responseSelectors.push({
      query: 'body',
      func: function(node) {
        appendToSelectedItem(node, pendoAndGoogleScripts);
      },
    });
  }

  next();
});

harmonRouter.use(harmon([], responseSelectors));

module.exports = {
  harmonRouter,
};