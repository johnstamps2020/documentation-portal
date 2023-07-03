import '../stylesheets/modules/skipNav.css';

export function addSkipNav() {
  let contentId = 'contentStart';
  const article = document.querySelector('article');

  if (article) {
    if (article.id) {
      contentId = article.id;
    } else {
      article.setAttribute('id', contentId);
    }
  } else {
    const heading1 = document.querySelector('h1');
    if (heading1) {
      if (heading1.id) {
        contentId = heading1.id;
      } else {
        heading1.setAttribute('id', contentId);
      }
    }
  }

  const skipNav = document.createElement('a');
  skipNav.setAttribute('href', `#${contentId}`);
  skipNav.classList.add('skipNav');
  skipNav.innerText = 'Skip to main content';

  document.querySelector('body').prepend(skipNav);
}
