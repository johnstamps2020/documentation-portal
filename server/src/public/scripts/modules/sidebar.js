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

  let relativePathname = `${window.location.pathname}`.replace(
    baseUrl,
    ''
  );

  if (!relativePathname.endsWith('.html')) {
    relativePathname = relativePathname.concat('.html');
  }

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

async function addTocListener() {
  const toc = document.querySelector('nav[role="toc"]')
  ? document.querySelector('nav[role="toc"]')
  : document.querySelector('nav.toc');

  if(sessionStorage.getItem("tocPos")) {
    sessionStorage.removeItem("tocPos");
  }
  if(sessionStorage.getItem("tocExpandedItems")) {
    sessionStorage.removeItem("tocExpandedItems");
  }
  toc.addEventListener("click", e => {
    if(e.target.matches('a')) {
      sessionStorage.setItem("tocPos", e.target.closest('nav').scrollTop);
      const navUls = toc.querySelectorAll('li > ul');
      let expandedUls = [];
      navUls.forEach((nestedList, index) => {
        if(!nestedList.classList.contains('expanded')) {
          return;
        }
        else {
          expandedUls.push(index);
        }
      })
      sessionStorage.setItem("tocExpandedItems", expandedUls);
    }
  })
}

async function setTocPositionAndState() {
  const toc = document.querySelector('nav[role="toc"]') ? document.querySelector('nav[role="toc"]') : document.querySelector('nav.toc');

  if(sessionStorage.getItem("tocExpandedItems")) {
    const navUls = toc.querySelectorAll('li > ul');
    navUls.forEach((nestedList, index) => {

      if(sessionStorage.getItem("tocExpandedItems").split(",").includes(index.toString())) {
        nestedList.classList.add('expanded');
        const listHeading = nestedList.parentElement.firstChild;
        const caret = listHeading.querySelector('.caret');
        caret.classList.add('open');
      }
    })
  }
  if(sessionStorage.getItem("tocPos")) {
      toc.scrollTop = sessionStorage.getItem("tocPos");
  }
}

async function trimHrefAnchors() {
  const toc = document.querySelector('nav[role="toc"]') ? document.querySelector('nav[role="toc"]') : document.querySelector('nav.toc');
  const tocLinks = toc.getElementsByTagName('a');
  for(let i = 0; i < tocLinks.length; i++) {
    const href = tocLinks.item(i).getAttribute('href');
    
    if(href.includes('#')) {
      const trimmedHref = href.substring(0, href.indexOf('#'));
      tocLinks.item(i).setAttribute('href', trimmedHref);
    }
  }
}

export async function setUpSidebar() {
  addCaret();
  await trimHrefAnchors();
  await setTocPositionAndState();
  expandCurrent();
  await addTocListener();
}
