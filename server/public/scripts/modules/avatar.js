import '../../stylesheets/modules/avatar.css';

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

function createAvatarButton(fullName, username) {
  const button = document.createElement('button');
  button.setAttribute('id', 'avatarButton');
  button.setAttribute('class', 'headerButtonsButton');
  button.setAttribute('aria-label', 'user information');
  button.setAttribute('type', 'button');
  button.addEventListener('click', showAvatarMenu);
  window.addEventListener('click', closeAvatarMenu);
  button.innerHTML = `
    <div id="avatarMenu" class="headerButtonsMenu">
        <div class="headerButtonsMenuHeader">
            <div class="avatarMenuName">${fullName}</div>
            <div class="avatarMenuEmail">${username}</div>
        </div>
        <hr class="headerButtonsMenuDivider"/>
        <div class="headerButtonsMenuActions">
            <a class="avatarMenuLogout" href="/gw-logout">Log out</a>
        </div>
    </div>`;

  return button;
}

function getLoginButtonOrAvatar() {
  let userButton;
  const { isLoggedIn, name, preferred_username } = window.userInformation;

  if (isLoggedIn) {
    userButton = createAvatarButton(name, preferred_username);
  } else {
    userButton = document.createElement('a');
    userButton.setAttribute('id', 'loginButton');
    userButton.setAttribute('href', '/gw-login');
    userButton.innerText = 'Log in';
  }
  return userButton;
}

export function addAvatar() {
  try {
    const userButton = getLoginButtonOrAvatar();
    document.getElementById('headerRight').appendChild(userButton);
  } catch (error) {
    console.log(error);
  }
}
