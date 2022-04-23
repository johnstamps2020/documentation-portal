import '../../stylesheets/modules/sidebar.css';

function bubbleUpExpanded(element) {
  const closest = element.parentElement?.closest('ul');
  if (closest) {
    closest.classList.add('expanded');

    const listHeading = closest.parentElement.firstChild;
    if (listHeading.classList.contains('listHeading')) {
      const caret = listHeading.querySelector('.caret');
      if (caret) {
        caret.classList.add('open');
      }
    }

    bubbleUpExpanded(closest);
  }
}

function getNodeByTitle() {
  const pageTitle = document.querySelector('title').textContent;
  const navLinks = document.querySelectorAll("nav[role='toc'] a").length > 0
    ? document.querySelectorAll("nav[role='toc'] a")
    : document.querySelectorAll("nav.toc a");
  for (let i = 0, len = navLinks.length; i < len; i++) {
    const a = navLinks[i];
    if (a.textContent.trim() === pageTitle) {
      return a;
    }
  }
}

function expandCurrent() {
  const baseUrl =
    document
      .querySelector('meta[name="gw-base-url"]')
      ?.getAttribute('content') || '';

  const relativePathname = `${window.location.pathname}.html`.replace(
    baseUrl,
    ''
  );

  const fullPathQuery = `nav[role='toc'] a[href\$='${relativePathname}${window.location.hash}']`;
  const filenameQuery = `nav[role='toc'] a[href\$='${relativePathname}']`;
  const fullPathQuery371 = `nav.toc a[href\$='${relativePathname}${window.location.hash}']`;
  const filenameQuery371 = `nav.toc a[href\$='${relativePathname}']`;
  const currentNode =
    document.querySelector(fullPathQuery) ||
    document.querySelector(filenameQuery) ||
    document.querySelector(fullPathQuery371) ||
    document.querySelector(filenameQuery371) ||
    getNodeByTitle() ||
    document.querySelector('.active a');

  if (currentNode) {
    currentNode.classList.add('current');

    const siblingCaret = currentNode.nextSibling;
    if (siblingCaret && siblingCaret.classList.contains('caret')) {
      siblingCaret.classList.add('open');
    }

    bubbleUpExpanded(currentNode);

    const childList = currentNode.closest('li').querySelector('ul');
    if (childList) {
      childList.classList.add('expanded');
    }
  }
}

function addCaret() {
  const navUls = document.querySelectorAll("nav[role='toc'] li > ul").length > 0
    ? document.querySelectorAll("nav[role='toc'] li > ul")
    : document.querySelectorAll("nav.toc li > ul");
  navUls.forEach(nestedList => {
    nestedList.classList.add('nestedList');
    const caret = document.createElement('button');
    caret.setAttribute('type', 'button');
    caret.setAttribute('aria-label', 'expand');
    caret.classList.add('caret');

    function expandItem() {
      nestedList.classList.toggle('expanded');
      caret.classList.toggle('open');
    }

    caret.addEventListener('click', expandItem);

    const listLabel = nestedList.parentElement.firstChild;
    listLabel.classList.add('listLabel');
    if (listLabel.nodeName === 'SPAN') {
      listLabel.classList.add('expandableLabel');
      listLabel.setAttribute('role', 'button');
      listLabel.setAttribute('tabindex', 0);

      listLabel.addEventListener('click', expandItem);
    }

    const listHeading = document.createElement('span');
    listHeading.classList.add('listHeading');
    listHeading.appendChild(listLabel);
    listHeading.appendChild(caret);

    const parentListItem = nestedList.parentElement;
    parentListItem.prepend(listHeading);
  });
}

export function setUpSidebar() {
  addCaret();
  expandCurrent();
}
