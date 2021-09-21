function createAvatarButton(fullName, username) {
  const avatar = document.createElement('div');
  avatar.setAttribute('id', 'avatar');
  avatar.innerHTML = `
        <button 
          id="avatarButton" 
          aria-label="user information"
        >
          <div class="avatarMenu">
            <div class="avatarMenuHeader">
              <div class="avatarMenuIcon">&nbsp;</div>
              <div class="avatarMenuInfo">
                <div class="avatarMenuName">${fullName}</div>
                <div class="avatarMenuEmail">${username}</div>
              </div>
            </div>
            <div class="avatarMenuDivider"></div>
            <div class="avatarMenuActions">
              <a class="avatarMenuLogout" href="/gw-logout">Log out</a>
            </div>
          </div>
        </button>
      `;
  return avatar;
}

async function setLogInButton(attemptNumber = 1, retryTimeout = 10) {
  const retryAttempts = 5;

  if (window.location.pathname.endsWith('gw-login')) {
    return;
  }
  // /userInformation is not available for a few milliseconds
  // after login, so if fetching the response fails, try again
  // in 10ms.
  try {
    const loginButton = document.querySelector('#loginButton');
    const response = await fetch('/userInformation');
    const { isLoggedIn, name, preferred_username } = await response.json();
    if (isLoggedIn && loginButton) {
      const userButton = createAvatarButton(name, preferred_username);
      loginButton.parentElement.replaceChild(userButton, loginButton);
    } else if (loginButton) {
      loginButton.classList.remove('invisible');
    }
  } catch (error) {
    if (attemptNumber >= retryAttempts) {
      console.log('Could not access user information endpoint. ' + error);
      return;
    }
    attemptNumber++;
    retryTimeout += 100;
    setTimeout(
      async () => setLogInButton(attemptNumber, retryTimeout),
      retryTimeout
    );
  }
}

function selectToggleButton() {
  const toggleButtons = document.querySelectorAll(
    '#platformToggle > .toggleButton'
  );
  if (toggleButtons.length === 0) {
    return;
  }
  let matchingButton = document.querySelector('#platformToggle > #cloudButton');
  const currentPath = window.location.pathname;
  toggleButtons.forEach(button => {
    const root = button.getAttribute('data-root');
    if (currentPath.startsWith(root)) {
      matchingButton = button;
    }
  });
  matchingButton.classList.toggle('selected');
  matchingButton.removeAttribute('href');
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

function setSearchFilterCSS() {
  if(window.location.pathname.startsWith('/search')) {
    const header = document.querySelector('.header-search');
    const filter = document.querySelector('.filterSearchResults')
    const resizeObserver = new ResizeObserver(entries => {
    for(let entry of entries) {
      const headerPaddingTop = window.getComputedStyle(header).getPropertyValue('padding-top');
      const headerPaddingBottom = window.getComputedStyle(header).getPropertyValue('padding-bottom');
      let headerContentSize;
      if(entry.contentBoxSize) {
        headerContentSize = entry.contentBoxSize[0].blockSize + 'px';
      }
      else {
        headerContentSize = entry.contentRect[0].height + 'px';
      }
      filter.style.top = 'calc(' + headerContentSize + ' + ' + headerPaddingTop + ' + ' + headerPaddingBottom + ')';
      filter.style.height = 'calc(100% - ' + headerContentSize + ' - ' + headerPaddingTop + ' - ' + headerPaddingBottom + ')';
    }
  })
  resizeObserver.observe(header);
  }
}

window.onload = function() {
  // markDocsAsNotPrivate();
  setLogInButton();
  selectToggleButton();
  addReleaseBadge();
  setSearchFilterCSS();
};
