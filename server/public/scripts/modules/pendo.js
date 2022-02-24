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

function getUserEmailOrFail() {
  const userInfo = window.userInformation;
  if (userInfo) {
    if (userInfo.isLoggedIn) {
      return userInfo.preferred_username;
    } else {
      return 'no.email@no.domain.com';
    }
  } else {
    return undefined;
  }
}

export function installAndInitializePendo() {
  installPendo('f254cb71-32f1-4247-546f-fe9159040603');

  const email = getUserEmailOrFail();
  if (!email) {
    console.error(
      'Cannot initialize Pendo because user information is missing!'
    );
  } else {
    const domain = email.split('@')[1] || 'unknown';
    const name = window.userInformation?.name || 'Unknown Person';

    pendo.initialize({
      visitor: {
        id: email,
        email: email,
        full_name: name,
        role: window.userInformation.hasGuidewireEmail
          ? 'employee'
          : 'customer/partner',
      },

      account: {
        id: domain,
      },
    });
  }
}
