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
    
    const imgHref = `/images/${releaseName}-badge.svg`;
    const imgRequest = await fetch(imgHref);
    if (imgRequest.ok) {
      const img = document.createElement('img');
      img.setAttribute('src', imgHref);
      img.setAttribute('alt', '');
      div.appendChild(img);
    }
    
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
