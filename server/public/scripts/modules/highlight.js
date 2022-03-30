function toggleHighlightsOnPage(highlightButton) {
  document.querySelector('main').classList.toggle('noHighlight');
  highlightButton.classList.toggle('highlightDisabled');
}

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

export function addHighlightToggle() {
  const params = getSearchParams();
  if (params.has('hl')) {
    import('../../stylesheets/modules/highlight.css');
    const toggleDescription = 'Toggle search highlights';
    const highlightButton = document.createElement('button');
    highlightButton.setAttribute('id', 'highlightToggle');
    highlightButton.classList.add('highlightInBreadCrumbs');
    highlightButton.classList.add('navbarButton');
    highlightButton.setAttribute('type', 'button');
    highlightButton.setAttribute('aria-label', toggleDescription);
    highlightButton.setAttribute('title', toggleDescription);

    highlightButton.addEventListener('click', function() {
      toggleHighlightsOnPage(highlightButton);
    });

    const navbarRight = document.querySelector('#navbarRight');
    if (navbarRight) {
      navbarRight.appendChild(highlightButton);
    }
  }
}

export function highlightTextFromUrl() {
  const params = getSearchParams();
  if (params.has('hl')) {
    const wordsToHighlight = params.get('hl').split(',');
    for (const word of wordsToHighlight) {
      const re = new RegExp(`(?<!<[^>]*)(${word})`, 'gi');
      const main = document.querySelector('main');
      main.innerHTML = main.innerHTML.replace(re, `<mark>$1</mark>`);
    }
  }
}
