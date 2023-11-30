window.dataLayer = window.dataLayer || [];
const cookieConsentKey = 'cookie-consent-decision';
const cookieConsentDecision = localStorage.getItem(cookieConsentKey);

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

    if (cookieConsentDecision === 'allow') {
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
    }

    // Google Analytics
    gtag('js', new Date());

    gtag('config', 'G-QRTVTBY678');
    gtag('set', 'user_properties', {
      is_employee: isEmployee,
    });

    if (cookieConsentDecision === 'allow') {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
      });
    } else {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
      });
    }
  }
}

const buttonStyles = [
  'position: relative',
  'box-sizing: border-box',
  '-webkit-tap-highlight-color: transparent',
  'outline: 0px',
  'border: 0px',
  'cursor: pointer',
  'user-select: none',
  'vertical-align: middle',
  'appearance: none',
  'text-decoration: none',
  'font-weight: 500',
  'font-size: 14px',
  'line-height: 1.75',
  'text-transform: uppercase',
  'min-width: 64px',
  'border-radius: 4px',
  'transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  'color: rgb(255, 255, 255)',
  'background-color: rgb(0, 115, 157)',
  'box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
  'margin: 10px auto',
  'padding: 4px 10px',
].join(';');

function showCookieConsentModal() {
  const modal = document.createElement('dialog');

  modal.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  modal.style.padding = '24px';
  modal.style.border = '1.5px solid black';
  modal.style.zIndex = '1900';
  modal.style.color = 'black';

  modal.innerHTML = `
    <h2 style="margin-block-start: 0">This website uses cookies</h2>
      <p>We use cookies to analyze our traffic. You consent to our cookies if you continue to use our website.</p>
      <div class="cookieModalButtons" style="display:flex;gap:12px">
        <button autofocus id="cookieAllowButton" type="button" style="${buttonStyles}">Allow all cookies</button>
        <button id="cookieDenyButton" type="button" style="${buttonStyles}">Deny all cookies</button>
      </div>
  `;

  const allowButton = modal.querySelector('#cookieAllowButton');
  const denyButton = modal.querySelector('#cookieDenyButton');

  allowButton.addEventListener('click', () => {
    localStorage.setItem(cookieConsentKey, 'allow');
    modal.close();
    initializeAnalytics();
  });

  denyButton.addEventListener('click', () => {
    localStorage.setItem(cookieConsentKey, 'deny');
    modal.close();
    initializeAnalytics();
  });

  setTimeout(() => {
    document.body.appendChild(modal);
    modal.showModal();
  }, 1000);
}

initializeAnalytics();

window.addEventListener('load', () => {
  if (!cookieConsentDecision) {
    showCookieConsentModal();
  }
});
