import { Router } from 'express';
import { winstonLogger } from '../controllers/loggerController';
// @ts-ignore
import harmon from 'harmon';
import { bodyScripts, headScripts } from '../controllers/analyticsController';

function appendToSelectedItem(node: any, str: string) {
  let readStream: any = null;
  let writeStream: any = null;

  try {
    readStream = node.createReadStream();
    writeStream = node.createWriteStream();

    // read, but do not end the stream
    readStream.pipe(writeStream, { end: false });

    // when the stream has ended, attach
    readStream.on('end', function () {
      writeStream.end(str);
      readStream = null;
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

const responseSelectors: harmon.Select[] = [
  {
    query: 'head',
    func: function (node) {
      appendToSelectedItem(node, headScripts);
    },
  },
  {
    query:
      // HTML5 -> div.footerContents
      // Webhelp -> header.wh_header
      // Docusaurus -> div#__docusaurus
      // Storybook -> div[style="position: static !important;"]
      // DevConnect -> footer[class="section bg-gray pb-0"]
      'div.footerContents, header.wh_header, div#__docusaurus, div[style="position: static !important;"], footer[class="section bg-gray pb-0"]',
    func: function (node) {
      appendToSelectedItem(node, bodyScripts);
    },
  },
];

const harmonRouter = Router();

harmonRouter.use(harmon([], responseSelectors));

module.exports = {
  harmonRouter,
};
