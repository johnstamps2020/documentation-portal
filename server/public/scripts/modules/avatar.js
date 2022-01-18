function showAvatarMenu(event) {
  if (event.target.id === 'avatarButton') {
    const avatarMenu = document.getElementById('avatarMenu');
    avatarMenu.classList.toggle('show');
  }
}

function closeAvatarMenu(event) {
  if (!event.target.closest('#avatarButton')) {
    const avatarMenu = document.getElementById('avatarMenu');
    if (avatarMenu.classList.contains('show')) {
      avatarMenu.classList.remove('show');
    }
  }
}

export function createAvatarButton(fullName, username) {
  const button = document.createElement('button');
  button.setAttribute('id', 'avatarButton');
  button.setAttribute('aria-label', 'user information');
  button.addEventListener('click', showAvatarMenu);
  window.addEventListener('click', closeAvatarMenu);
  button.innerHTML = `
    <div class="avatarMenu" id="avatarMenu">
        <div class="avatarMenuHeader">
        <div class="avatarMenuIcon">&nbsp;</div>
        <div class="avatarMenuInfo">
            <div class="avatarMenuName">${fullName}</div>
            <div class="avatarMenuEmail">${username}</div>
        </div>
        </div>
        <hr class="avatarMenuDivider"/>
        <div class="avatarMenuActions">
        <a class="avatarMenuLogout" href="/gw-logout">Log out</a>
        </div>
    </div>`;

  const avatar = document.createElement('div');
  avatar.setAttribute('id', 'avatar');
  avatar.appendChild(button);
  return avatar;
}

function getLoginButtonOrAvatar() {
  const buttonWrapper = document.createElement('div');
  let userButton;
  const { isLoggedIn, name, preferred_username } = window.userInformation;

  if (isLoggedIn) {
    buttonWrapper.setAttribute('class', 'loginLogoutButtonWrapper');
    userButton = createAvatarButton(name, preferred_username);
  } else {
    buttonWrapper.setAttribute('id', 'loginContainer');
    userButton = document.createElement('a');
    userButton.setAttribute('id', 'loginButton');
    userButton.setAttribute('href', '/gw-login');
    userButton.innerText = 'Log in';
  }
  buttonWrapper.appendChild(userButton);

  return buttonWrapper;
}

export function addAvatar(attemptNumber = 1, retryTimeout = 10) {
  const retryAttempts = 5;

  if (window.location.pathname.endsWith('gw-login')) {
    return;
  }
  // /userInformation is not available for a few milliseconds
  // after login, so if fetching the response fails, try again
  // in 10ms.
  try {
    const userButton = getLoginButtonOrAvatar();
    document.getElementById('headerRight').appendChild(userButton);
  } catch (error) {
    if (attemptNumber >= retryAttempts) {
      console.log('Could not access user information endpoint. ' + error);
      return;
    }
    attemptNumber++;
    retryTimeout += 100;
    setTimeout(
      async () => addAvatar(attemptNumber, retryTimeout),
      retryTimeout
    );
  }
}
