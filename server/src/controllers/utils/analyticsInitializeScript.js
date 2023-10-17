window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

function scramble(phrase) {
  let hash = 0,
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
  const parts = email?.includes('@') ? email.split('@') : [];
  if (parts.length === 2) {
    const scrambledLogin = scramble(parts[0]);
    return `${scrambledLogin}@${parts[1]}`;
  }

  return 'cannot.get.email@unknown.com';
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

    return { email, name, role, domain, isEmployee };
  }

  return {
    email: 'anonymous@user.com',
    name: 'User Not Logged In',
    role: 'Not Logged In',
    domain: 'Not Logged In',
    isEmployee: false,
  };
}

async function initializeAnalytics() {
  const response = await fetch('/userInformation');
  if (response.ok) {
    const userInfo = await response.json();
    const { email, name, role, domain, isEmployee } = getUserData(userInfo);

    // Pendo
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

    // Google Analytics
    gtag('js', new Date());

    gtag('config', 'G-QRTVTBY678');
    gtag('set', 'user_properties', {
      is_employee: isEmployee,
    });
  }
}

initializeAnalytics();
