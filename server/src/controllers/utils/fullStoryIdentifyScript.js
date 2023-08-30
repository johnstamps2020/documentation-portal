async function identifyInFullStory() {
  const response = await fetch('/userInformation');
  if (response.ok) {
    const userInfo = await response.json();
    const { email, name, role, domain } = getUserData(userInfo);
    FS.identify(email, {
      displayName: name,
      email,
    });
    FS.setUserVars({
      email,
      name,
      role,
      domain,
    });
  }
}

window.addEventListener('load', function () {
  identifyInFullStory();
});
