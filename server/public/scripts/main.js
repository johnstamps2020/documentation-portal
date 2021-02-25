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
  for (const button of toggleButtons) {
    const root = button.getAttribute('data-root');
    const currentPath = window.location.pathname;
    if (currentPath.startsWith(root)) {
      button.classList.toggle('selected');
    }
  }
}

function addReleaseBadge() {
  const cloudReleaseMatch = window.location.href.match(
    /\/cloudProducts\/([^/]+)\//
  );
  if (cloudReleaseMatch) {
    const releaseName = cloudReleaseMatch[1];
    const img = document.createElement('img');
    img.setAttribute('src', `/images/${releaseName}-badge.svg`);
    img.setAttribute('alt', '');

    const p = document.createElement('p');
    p.innerHTML = `${releaseName.charAt(0).toUpperCase() +
      releaseName.slice(1)} Release`;

    const div = document.createElement('div');
    div.setAttribute('style', 'display: flex; align-items: center; gap: 6px');
    div.appendChild(img);
    div.appendChild(p);

    const footerLeft = document.querySelector('#footerLeft');
    if (footerLeft) {
      footerLeft.appendChild(div);
    }
  }
}

window.onload = function() {
  setLogInButton();
  selectToggleButton();
  addReleaseBadge();
};
