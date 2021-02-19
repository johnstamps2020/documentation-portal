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

window.onload = function() {
  setLogInButton();
  selectToggleButton();
};
