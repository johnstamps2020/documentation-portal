const JSDOM = require('jsdom').JSDOM;
const { winstonLogger } = require('./loggerController');

function getDOM(responseBuffer, proxyResObject) {
  try {
    if (
      proxyResObject &&
      proxyResObject.headers['content-type'] === 'text/html'
    ) {
      const response = responseBuffer.toString('utf8');
      const responseDOM = new JSDOM(response);
      const { document } = responseDOM.window;
      if (document) {
        const html = document.querySelector('html');
        const head = document.querySelector('head');
        const body = document.querySelector('body');
        if (html && head && body) {
          return { responseDOM, document };
        }
      }
    }
  } catch (err) {
    winstonLogger.error(
      `error: '[INTERCEPTOR] Cannot get DOM',
        responseBuffer: ${responseBuffer},
        proxyResObject: ${proxyResObject},`
    );
  }

  return undefined;
}

function removeTagsWithMatchingText(tagName, strToMatch, document) {
  try {
    const allTags = document.querySelectorAll(tagName);
    for (const tag of allTags) {
      if (
        !!tag.textContent.match(strToMatch) ||
        !!tag.innerHTML.match(strToMatch)
      ) {
        tag.remove();
      }
    }
  } catch (err) {
    winstonLogger.error(
      `error: '[INTERCEPTOR] Cannot remove tag',
          tagName: ${tagName},
          strToMatch: ${strToMatch},
          document: ${document},`
    );
  }
}

function insertTagWithContent(
  tagName,
  strContent,
  comment,
  parentName,
  document
) {
  try {
    const parent = document.querySelector(parentName);

    if (parent) {
      const startingComment = document.createComment(comment);
      parent.appendChild(startingComment);

      const tagToInsert = document.createElement(tagName);
      tagToInsert.textContent = strContent;
      parent.appendChild(tagToInsert);

      const endComment = document.createComment(`End ${comment}`);
      parent.appendChild(endComment);
    }
  } catch (err) {
    winstonLogger.error(
      `message: '[INTERCEPTOR] Cannot insert tag with content',
        tagName: ${tagName},
        strContent: ${strContent},
        comment: ${comment},
        parentName: ${parentName},
        document: ${document},`
    );
  }
}

async function interceptAndUpdateDocPage(responseBuffer, proxyRes, req, res) {
  const bufferLength = responseBuffer.length;
  if (bufferLength > 800000) {
    return responseBuffer;
  }
  const dom = getDOM(responseBuffer, proxyRes);
  if (dom) {
    try {
      const { responseDOM, document } = dom;
      const {
        tagManagerHeadScript,
        tagManagerBody,
        pendoInstallScript,
        pendoInitializeScript,
      } = res.locals.analytics;

      // Remove GTM script, if it exists
      removeTagsWithMatchingText('script', 'gtm.start', document);

      // Remove GTM noscript, if it exists
      removeTagsWithMatchingText('noscript', 'googletagmanager.com', document);

      // Add Google Tag Manager in the Head
      insertTagWithContent(
        'script',
        tagManagerHeadScript,
        'Google Tag Manager (inserted on the server)',
        'head',
        document
      );

      // Add Google Tag Manager noscript in the body
      insertTagWithContent(
        'noscript',
        tagManagerBody,
        'Google Tag Manager (noscript, inserted on the server)',
        'body',
        document
      );

      // Add Pendo install script
      insertTagWithContent(
        'script',
        pendoInstallScript,
        'Pendo install script',
        'head',
        document
      );

      // Add Pendo INITIALIZE script
      insertTagWithContent(
        'script',
        pendoInitializeScript,
        'Pendo INITIALIZE',
        'body',
        document
      );

      return responseDOM.serialize();
    } catch (err) {
      winstonLogger.error(
        `message: '[INTERCEPTOR] Cannot intercept and update page',
          responseBuffer: ${responseBuffer},
          proxyRes: ${proxyRes},
          req: ${req},
          res: ${res},`
      );
    }
  } else {
    return responseBuffer;
  }
}

module.exports = interceptAndUpdateDocPage;
