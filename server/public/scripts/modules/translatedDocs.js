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

export function createTranslatedDocsButton(availableTranslatedPages) {
  const button = document.createElement('button');
  button.setAttribute('id', 'translatedDocsButton');
  button.setAttribute('aria-label', 'translated documentation');
  button.addEventListener('click', showTranslatedDocsMenu);
  window.addEventListener('click', closeTranslatedDocsMenu);

  const translatedDocsMenuActions = document.createElement('div');
  translatedDocsMenuActions.setAttribute('class', 'translatedDocsMenuActions');
  availableTranslatedPages.forEach(p => {
    const translatedPage = document.createElement('div');
    translatedPage.setAttribute('class', 'translatedPage');
    const translatedPageLink = document.createElement('a');
    translatedPageLink.setAttribute('href', `/l10n/${p.page}`);
    translatedPageLink.innerHTML = p.label;
    translatedPage.appendChild(translatedPageLink);
    translatedDocsMenuActions.appendChild(translatedPage);
  });

  const translatedDocsMenu = document.createElement('div');
  translatedDocsMenu.setAttribute('class', 'translatedDocsMenu');
  translatedDocsMenu.setAttribute('id', 'translatedDocsMenu');
  translatedDocsMenu.appendChild(translatedDocsMenuActions);
  button.appendChild(translatedDocsMenu);

  const translatedDocs = document.createElement('div');
  translatedDocs.setAttribute('id', 'translatedDocs');
  translatedDocs.appendChild(button);
  return translatedDocs;
}

export function addTranslatedDocs(availableTranslatedPages) {
  try {
    const translatedDocsButtonWrapper = document.createElement('div');
    translatedDocsButtonWrapper.setAttribute(
      'class',
      'translatedDocsButtonWrapper'
    );
    const translatedDocsButton = createTranslatedDocsButton(
      availableTranslatedPages
    );
    translatedDocsButtonWrapper.appendChild(translatedDocsButton);
    document
      .getElementById('translatedDocsContainer')
      .appendChild(translatedDocsButtonWrapper);
  } catch (error) {
    console.log(error);
  }
}
