import { Router } from 'express';
import { winstonLogger } from '../controllers/loggerController';
// @ts-ignore
import harmon from 'harmon';

import {
  tagManagerHeadScript,
  pendoInstallScript,
  tagManagerBody,
  getPendoInitializeScript,
  getFullStoryIdentifyScript,
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
  } catch (err) {
    winstonLogger.error(`ERROR overwriting response using Harmon: 
          ERROR: ${JSON.stringify(err)}
          MESSAGE: ${err}`);
  }
}

const pendoInitializeScript = getPendoInitializeScript();
const fullStoryIdentifyScript = getFullStoryIdentifyScript();
const bodyScriptsForAnalytics = `
      <!-- Pendo initialize -->
      <script>${pendoInitializeScript}</script>
      <!-- Google tag manager no-script -->
      <noscript>${tagManagerBody}</noscript>
      <!-- FullStory identify -->
      <script>${fullStoryIdentifyScript}</script>`;

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
      // Docusaurus -> body.navigation-with-keyboard
      // Storybook -> div[style="position: static !important;"]
      'div.footerContents, header.wh_header, body.navigation-with-keyboard, div[style="position: static !important;"]',
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
