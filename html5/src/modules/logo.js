export function addLogo() {
  const logoLink = document.createElement('a');
  logoLink.setAttribute('href', '/');
  logoLink.setAttribute('aria-label', 'home');
  logoLink.setAttribute('class', 'logo');
  const headerLeft = document.getElementById('headerLeft');
  headerLeft.appendChild(logoLink);
}
