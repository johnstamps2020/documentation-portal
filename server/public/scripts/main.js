function toggleAvatar(e) {
  e.target.classList.toggle('expanded');
}

async function setLogInButton() {
  if(window.location.pathname.endsWith('gw-login')) {
    return;
  }
  // /userInformation is not available for a few milliseconds
  // after login, so if fetching the response fails, try again
  // in 10ms.
  try {
    const response = await fetch('/userInformation');
    const responseBody = await response.json();
    const { isLoggedIn, name, preferred_username } = responseBody;
    const loginButton = document.querySelector('#loginButton');

    if (isLoggedIn && loginButton) {
      
        const avatar = document.createElement('div');
        avatar.setAttribute('id', 'avatar');
        avatar.innerHTML = `
        <button 
          id="avatarButton" 
          onClick="toggleAvatar(e)" 
          aria-label="user information"
        >
          <div class="avatarMenu">
            <div class="avatarMenuHeader">
              <div class="avatarMenuIcon">&nbsp;</div>
              <div class="avatarMenuInfo">
                <div class="avatarMenuName">${name}</div>
                <div class="avatarMenuEmail">${preferred_username}</div>
              </div>
            </div>
            <div class="avatarMenuDivider"></div>
            <div class="avatarMenuActions">
              <a class="avatarMenuLogout" href="/gw-logout">Log out</a>
            </div>
          </div>
        </button>
      `;

        let newAvatar = loginButton.parentElement.replaceChild(
          avatar,
          loginButton
        );
    }
    else if (loginButton) {
      loginButton.classList.remove('invisible')
    }
  }
  catch (error) {
    setTimeout(setLogInButton, 10);
  }
}

function selectToggleButton() {
  const toggleButtons = document.querySelectorAll('#cloudToggle > a');
  if(toggleButtons.length === 0) {
    return
  }
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
