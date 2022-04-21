const JSDOM = require('jsdom').JSDOM;

function getDOM(responseBuffer, proxyResObject) {
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

  return undefined;
}

function removeTagsWithMatchingText(tagName, strToMatch, document) {
  const allTags = document.querySelectorAll(tagName);
  allTags.forEach(tag => {
    if (
      !!tag.textContent.match(strToMatch) ||
      !!tag.innerHTML.match(strToMatch)
    ) {
      tag.remove();
    }
  });
}

function insertTagWithContent(
  tagName,
  strContent,
  comment,
  parentName,
  document
) {
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
}

async function interceptAndUpdateDocPage(responseBuffer, proxyRes, req, res) {
  const dom = getDOM(responseBuffer, proxyRes);
  if (dom) {
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
  } else {
    return responseBuffer;
  }
}

module.exports = interceptAndUpdateDocPage;
