const { winstonLogger } = require('./loggerController');
const fs = require('fs');
const path = require('path');

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

function getPendoInitializeScript() {
  try {
    const scriptPath = path.join(
      __dirname,
      'utils',
      'pendoInitializeScript.js'
    );
    const fileContents = fs.readFileSync(scriptPath, {
      encoding: 'utf8',
    });
    return fileContents;
  } catch (err) {
    winstonLogger.error(
      `Problem getting pendo initialize script:
          ERROR: ${JSON.stringify(err)}`
    );
  }
}

module.exports = {
  tagManagerHeadScript,
  tagManagerBody,
  pendoInstallScript,
  getPendoInitializeScript,
};
