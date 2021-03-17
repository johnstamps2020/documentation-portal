async function setLogInButton() {
  const response = await fetch('/userInformation');
  const responseBody = await response.json();
  const { isLoggedIn, name } = responseBody;

  if (isLoggedIn) {
    const loginButton = document.querySelector('#loginButton');
    loginButton.innerHTML = `Log out ${name}`;
    loginButton.setAttribute('href', '/gw-logout');
  }
}

function selectToggleButton() {
  const toggleButtons = document.querySelectorAll('#cloudToggle > a');
  let matchingButton = toggleButtons[0];
  const currentPath = window.location.pathname;
  toggleButtons.forEach(button => {
    const root = button.getAttribute('data-root');
    if (currentPath.startsWith(root)) {
      matchingButton = button;
    }
  });
  matchingButton.classList.toggle('selected');
}

async function addReleaseBadge() {
  const cloudReleaseMatch = window.location.href.match(
    /\/cloudProducts\/([^/]+)\//
  );
  if (cloudReleaseMatch) {
    const releaseName = cloudReleaseMatch[1];

    const p = document.createElement('p');
    p.innerHTML = `${releaseName.charAt(0).toUpperCase() +
      releaseName.slice(1)} Release`;

    const div = document.createElement('div');
    div.setAttribute('class', 'releaseInfo');

    const imgHref = `/images/badge-${releaseName}.svg`;
    const imgRequest = await fetch(imgHref);
    if (imgRequest.ok) {
      const img = document.createElement('img');
      img.setAttribute('src', imgHref);
      img.setAttribute('alt', '');
      img.setAttribute('height', '24px');
      img.setAttribute('width', '24px');
      div.appendChild(img);
    }

    div.appendChild(p);

    const footerLeft = document.querySelector('#footerLeft');
    if (footerLeft) {
      footerLeft.appendChild(div);
    }
  }
}

function markDocsAsNotPrivate() {
  const privateDocs = document.querySelectorAll('.private');
  for (const privateDoc of privateDocs) {
    privateDoc.removeAttribute('href');

    const span = document.createElement('span');
    span.className = 'lockTooltipText';
    span.innerHTML = 'Log in to view this content';

    privateDoc.appendChild(span);
  }
}

window.onload = function() {
  // markDocsAsNotPrivate();
  setLogInButton();
  selectToggleButton();
  addReleaseBadge();
};
