import '../../stylesheets/modules/skipNav.css';

export function addSkipNav() {
  let articleId = 'articleContent';
  const article = document.querySelector('article');
  if (article.id) {
    articleId = article.id;
  } else {
    article.setAttribute('id', articleId);
  }

  const skipNav = document.createElement('a');
  skipNav.setAttribute('href', `#${articleId}`);
  skipNav.classList.add('skipNav');
  skipNav.innerText = 'Skip to main content';

  document.querySelector('body').prepend(skipNav);
}
