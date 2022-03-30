import '../../stylesheets/modules/skipNav.css';

export function addSkipNav() {
  let mainId = 'mainContent';
  const main = document.querySelector('main');
  if (main.id) {
    mainId = main.id;
  } else {
    main.setAttribute('id', mainId);
  }

  const skipNav = document.createElement('a');
  skipNav.setAttribute('href', `#${mainId}`);
  skipNav.classList.add('skipNav');
  skipNav.innerText = 'Skip to main content';

  document.querySelector('body').prepend(skipNav);
}
