import '../../stylesheets/modules/hashLink.css';

function isHidden(element) {
  return element.offsetParent === null;
}

export async function addHashLinks() {
  const idsInDoc = [];

  function generateId(element) {
    let idString =
      element.parentElement.getAttribute('id') ||
      element.getAttribute('id') ||
      element.textContent.replace(/[^a-zA-Z0-9]/g, '');
    if (idsInDoc.includes(idString)) {
      idString = idString + +new Date().getTime();
    }
    idsInDoc.push(idString);

    return idString;
  }

  document.querySelectorAll('.title').forEach((title, index) => {
    if (
      !isHidden(title) &&
      index !== 0 &&
      !title.parentElement.parentElement.classList.contains('landingpage')
    ) {
      const id = generateId(title);
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
