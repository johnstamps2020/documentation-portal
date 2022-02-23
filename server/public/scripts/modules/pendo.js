export function installAndInitializePendo() {
  (function(apiKey) {
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
  })('f254cb71-32f1-4247-546f-fe9159040603');

  const email = window.userInformation.preferred_username;
  const domain = email.split('@')[1] || 'unknown';
  const name = userInformation.name;

  pendo.initialize({
    visitor: {
      id: email,
      email: email,
      full_name: name,
      role: userInformation.hasGuidewireEmail ? 'employee' : 'customer/partner',
    },

    account: {
      id: domain, // Required if using Pendo Feedback
      // name:         // Optional
      // is_paying:    // Recommended if using Pendo Feedback
      // monthly_value:// Recommended if using Pendo Feedback
      // planLevel:    // Optional
      // planPrice:    // Optional
      // creationDate: // Optional

      // You can add any additional account level key-values here,
      // as long as it's not one of the above reserved names.
    },
  });
}
