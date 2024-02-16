export function addPdfLink() {
  const pdfLink = document.querySelector("meta[name='pdf-link']")?.content;
  const pdfTitle = document.querySelector("meta[name='pdf-title']")?.content;

  if (!pdfLink || !pdfTitle) {
    return;
  }

  const lang = document.documentElement.lang;
  const regex = /Open (.*)/;
  const pdfTitleFormatted = lang.startsWith('en')
    ? pdfTitle
    : pdfTitle.replace(regex, '$1');
  const pdfLinkElement = createPdfLinkElement(pdfLink, pdfTitleFormatted);

  const navbarRight = document.querySelector('#navbarRight');
  if (navbarRight) {
    navbarRight.appendChild(pdfLinkElement);
  }
}

function createPdfLinkElement(pdfLink, pdfTitle) {
  const pdfLinkElement = document.createElement('a');
  pdfLinkElement.classList.add('navbarButton');
  pdfLinkElement.classList.add('pdfButton');
  pdfLinkElement.setAttribute('href', pdfLink);
  pdfLinkElement.setAttribute('title', pdfTitle);
  pdfLinkElement.setAttribute('aria-label', pdfTitle);
  pdfLinkElement.setAttribute('target', '_blank');
  return pdfLinkElement;
}
