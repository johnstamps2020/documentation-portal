import '../stylesheets/modules/hashLink.css';

function isHidden(element: HTMLElement) {
  return element.offsetParent === null;
}

function generateId(element: Element, idsInDoc: string[]) {
  let idString =
    element.parentElement.getAttribute('id') ||
    element.getAttribute('id') ||
    element.textContent?.replace(/[^a-zA-Z0-9]/g, '');
  if (idsInDoc.includes(idString)) {
    idString = idString + +new Date().getTime();
  }
  idsInDoc.push(idString);

  return idString;
}

export async function addHashLinks() {
  const idsInDoc: string[] = [];

  document.querySelectorAll('.title').forEach((title, index) => {
    if (
      !isHidden(title as HTMLElement) &&
      index !== 0 &&
      !title.parentElement.parentElement.classList.contains('landingpage')
    ) {
      const id = generateId(title, idsInDoc);
      if (!document.getElementById(id)) {
        title.setAttribute('id', id);
      }

      title.classList.add('hashLinkParent');

      const hashLink = document.createElement('a');
      hashLink.setAttribute('href', `#${id}`);
      hashLink.setAttribute('class', 'hashLink');
      hashLink.setAttribute(
        'title',
        `Direct link to heading: ${title.textContent}`
      );

      title.appendChild(hashLink);
    }
  });

  const idFromUrl = window.location.href.split('#').at(-1);
  if (idFromUrl && idsInDoc.includes(idFromUrl)) {
    document.getElementById(idFromUrl).scrollIntoView({ behavior: 'smooth' });
  }
}
