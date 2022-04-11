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
  const scrambledLogin = scramble(parts[0]);
  return `${scrambledLogin}@${parts[1]}`;
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

export function installAndInitializePendo() {
  installPendo('f254cb71-32f1-4247-546f-fe9159040603');

  const { email, name, role, domain } = getUserData(window.userInformation);

  pendo.initialize({
    visitor: {
      id: email,
      email: email,
      full_name: name,
      role: role,
    },

    account: {
      id: domain,
    },
  });
}
