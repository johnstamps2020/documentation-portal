import { Router } from 'express';
import { winstonLogger } from '../controllers/loggerController';
// @ts-ignore
import harmon from 'harmon';

import {
  tagManagerHeadScript,
  pendoInstallScript,
  tagManagerBody,
  getAnalyticsInitializeScript,
} from '../controllers/analyticsController';

function appendToSelectedItem(node: any, str: string) {
  try {
    const readStream = node.createReadStream();
    const writeStream = node.createWriteStream();

    // read, but do not end the stream
    readStream.pipe(writeStream, { end: false });

    // when the stream has ended, attach
    readStream.on('end', function () {
      writeStream.end(str);
    });

    // Handle stream errors
    readStream.on('error', function (err: Error) {
      winstonLogger.error(`Reading stream error in Harmon 
      ERROR: ${JSON.stringify(err)}
      MESSAGE: ${err})`);
    });
    writeStream.on('error', function (err: Error) {
      winstonLogger.error(`Writing stream error in Harmon 
      ERROR: ${JSON.stringify(err)}
      MESSAGE: ${err})`);
    });
  } catch (err) {
    winstonLogger.error(`Response overwriting error in Harmon: 
          ERROR: ${JSON.stringify(err)}
          MESSAGE: ${err}`);
  }
}

const analyticsInitializeScript = getAnalyticsInitializeScript();
const bodyScriptsForAnalytics = `<!-- Google tag manager no-script -->
      <noscript>${tagManagerBody}</noscript>
      <!-- Analytics initialize -->
      <script>${analyticsInitializeScript}</script>
`;

const responseSelectors = [
  {
    query: 'head',
    func: function (node: any) {
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
  {
    query:
      // HTML5 -> div.footerContents
      // Webhelp -> header.wh_header
      // Docusaurus -> div#__docusaurus
      // Storybook -> div[style="position: static !important;"]
      'div.footerContents, header.wh_header, div#__docusaurus, div[style="position: static !important;"]',
    func: function (node: any) {
      appendToSelectedItem(node, bodyScriptsForAnalytics);
    },
  },
];

const harmonRouter = Router();

harmonRouter.use(harmon([], responseSelectors));

module.exports = {
  harmonRouter,
};
