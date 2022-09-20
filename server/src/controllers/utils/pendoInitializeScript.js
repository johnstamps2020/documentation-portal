export function scramble(phrase) {
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

export function getScrambledEmail(email) {
  const parts = email?.includes('@') ? email.split('@') : [];
  if (parts.length === 2) {
    const scrambledLogin = scramble(parts[0]);
    return `${scrambledLogin}@${parts[1]}`;
  }

  return 'cannot.get.email@unknown.com';
}

export function getEmployeeEmail(email) {
  return email.replace('guidewire.com', 'gw.employee.io');
}

export function getUserData(userInfo) {
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

export async function initializePendo() {
  const response = await fetch('/userInformation');
  if (response.ok) {
    const userInfo = await response.json();
    const { email, name, role, domain } = getUserData(userInfo);
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
}

initializePendo();
