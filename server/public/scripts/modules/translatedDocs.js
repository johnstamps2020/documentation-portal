function showTranslatedDocsMenu(event) {
  if (event.target.id === 'translatedDocsButton') {
    const translatedDocsMenu = document.getElementById('translatedDocsMenu');
    translatedDocsMenu.classList.toggle('show');
  }
}

function closeTranslatedDocsMenu(event) {
  if (!event.target.closest('#translatedDocsButton')) {
    const translatedDocsMenu = document.getElementById('translatedDocsMenu');
    if (translatedDocsMenu.classList.contains('show')) {
      translatedDocsMenu.classList.remove('show');
    }
  }
}

export function createTranslatedDocs(availableTranslatedPages) {
  const translatedDocsMenuActions = document.createElement('div');
  translatedDocsMenuActions.setAttribute('class', 'translatedDocsMenuActions');
  availableTranslatedPages.forEach(p => {
    const translatedPage = document.createElement('div');
    translatedPage.setAttribute('class', 'translatedPage');
    const translatedPageLink = document.createElement('a');
    translatedPageLink.setAttribute('href', p.pageUrl);
    translatedPageLink.innerHTML = p.label;
    translatedPage.appendChild(translatedPageLink);
    translatedDocsMenuActions.appendChild(translatedPage);
  });

  const translatedDocsMenu = document.createElement('div');
  translatedDocsMenu.setAttribute('class', 'translatedDocsMenu');
  translatedDocsMenu.setAttribute('id', 'translatedDocsMenu');
  translatedDocsMenu.appendChild(translatedDocsMenuActions);

  const translatedDocsButton = document.createElement('button');
  translatedDocsButton.setAttribute('id', 'translatedDocsButton');
  translatedDocsButton.setAttribute('aria-label', 'translated documentation');
  translatedDocsButton.addEventListener('click', showTranslatedDocsMenu);
  window.addEventListener('click', closeTranslatedDocsMenu);
  translatedDocsButton.appendChild(translatedDocsMenu);

  const translatedDocs = document.createElement('div');
  translatedDocs.setAttribute('id', 'translatedDocs');
  translatedDocs.appendChild(translatedDocsButton);

  document
    .getElementById('translatedDocsContainer')
    .appendChild(translatedDocs);
}
