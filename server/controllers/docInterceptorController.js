const JSDOM = require('jsdom').JSDOM;

const tagManagerHeadScript = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-PLXG9H5');
`;

const tagManagerBody = `
<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PLXG9H5" height="0" width="0" style="display: none; visibility: hidden"></iframe>
`;

const pendoInstallScript = `
function installPendo(apiKey) {
  (function(p, e, n, d, o) {
    var v, w, x, y, z;
    o = p[d] = p[d] || {};
    o._q = o._q || [];
    v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
    for (w = 0, x = v.length; w < x; ++w)
      (function(m) {
        o[m] =
          o[m] ||
          function() {
            o._q[m === v[0] ? 'unshift' : 'push'](
              [m].concat([].slice.call(arguments, 0))
            );
          };
      })(v[w]);
    y = e.createElement(n);
    y.async = !0;
    y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js';
    z = e.getElementsByTagName(n)[0];
    z.parentNode.insertBefore(y, z);
  })(window, document, 'script', 'pendo');
}
installPendo('f254cb71-32f1-4247-546f-fe9159040603');
`;

function getPendoInitializeScript(email, name, role, domain) {
  return `
  pendo.initialize({
    visitor: {
      id: "${email}",
      email: "${email}",
      full_name: "${name}",
      role: "${role}",
    },

    account: {
      id: "${domain}",
    },
  });
  `;
}

function containsHtml(str) {
  const match = str.match(/<html/i);
  return match;
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

  const startingComment = document.createComment(comment);
  parent.appendChild(startingComment);

  const tagToInsert = document.createElement(tagName);
  tagToInsert.textContent = strContent;
  parent.appendChild(tagToInsert);

  const endComment = document.createComment(`End ${comment}`);
  parent.appendChild(endComment);
}

function scramble(phrase) {
  var hash = 0,
    i,
    chr;
  if (phrase.length === 0) return hash;
  for (i = 0; i < phrase.length; i++) {
    chr = phrase.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

function getScrambledEmail(email) {
  const parts = email.split('@');
  if (parts.length === 2) {
    const scrambledLogin = scramble(parts[0]);
    return `${scrambledLogin}@${parts[1]}`;
  }

  return 'cannot.get.email@unkown.com';
}

function getEmployeeEmail(email) {
  return email.replace('guidewire.com', 'gw.employee.io');
}

function getUserData(userInfo) {
  if (userInfo.isLoggedIn) {
    const isEmployee = userInfo.hasGuidewireEmail;
    const role = isEmployee ? 'employee' : 'customer/partner';
    const email = isEmployee
      ? getEmployeeEmail(userInfo.preferred_username)
      : getScrambledEmail(userInfo.preferred_username);
    const name = isEmployee
      ? userInfo.name || 'Employee Name Not Set'
      : 'Anonymous User';
    const domain = email.split('@')[1];

    return { email, name, role, domain };
  }

  return {
    email: 'anonymous@user.com',
    name: 'User Not Logged In',
    role: 'Not Logged In',
    domain: 'Not Logged In',
  };
}

async function interceptAndUpdateDocPage(responseBuffer, proxyRes, req, res) {
  const response = responseBuffer.toString('utf8');
  if (containsHtml(response)) {
    const responseDOM = new JSDOM(response);
    const { document } = responseDOM.window;

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
    const { email, name, role, domain } = getUserData(res.locals.userInfo);
    const pendoInitializeScript = getPendoInitializeScript(
      email,
      name,
      role,
      domain
    );
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
