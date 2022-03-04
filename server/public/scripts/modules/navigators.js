import { highlightTextFromUrl, addHighlightToggle } from './highlight.js';
import { addPdfLink } from './pdflink.js';

function addMiniToc() {
  const hashLinks = document.querySelectorAll('.hashLink');
  if (hashLinks.length > 1) {
    const miniToc = document.createElement('nav');
    miniToc.setAttribute('class', 'miniToc');

    hashLinks.forEach(hashLink => {
      const title = hashLink.parentElement.textContent;
      const href = hashLink.getAttribute('href');
      const parentClasses = hashLink.parentElement.classList;

      if (title && href) {
        const navLink = document.createElement('a');
        navLink.setAttribute('href', href);
        navLink.classList.add('miniTocLink');
        parentClasses.forEach(className => {
          if (!className.match('^title$')) {
            navLink.classList.add(className);
          }
        });
        navLink.textContent = title;

        miniToc.appendChild(navLink);
      }
    });

    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const footer = document.querySelector('footer');
      footer.parentNode.insertBefore(sidebar, footer);
    }

    document.querySelector('main').after(miniToc);
  }
}

async function getTopBreadcrumb() {
  try {
    const currentPagePathname = window.location.pathname;
    const response = await fetch(
      `/safeConfig/breadcrumbs?pagePathname=${currentPagePathname}`
    );
    const jsonResponse = await response.json();
    const rootPageObject = jsonResponse.rootPage;
    if (Object.keys(rootPageObject).length !== 0) {
      const topBreadcrumb = {
        text: rootPageObject.label,
        href: rootPageObject.path,
      };
      return topBreadcrumb;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

function getParentNavItems(linkElement) {
  let allLinks = [];
  allLinks.push({
    text: linkElement.textContent,
    href: linkElement.getAttribute('href'),
  });

  const nextItem = linkElement.closest('li').parentElement.closest('li');
  const nextLinkElement = nextItem?.querySelector('*.listLabel');

  if (nextLinkElement) {
    allLinks.push(getParentNavItems(nextLinkElement).flat());
  }

  return allLinks;
}

function getCurrentLink() {
  return document.querySelector('nav[role="toc"] a.current');
}

async function addBreadCrumbs() {
  let currentLink = getCurrentLink();
  if (currentLink) {
    const linkTrail = getParentNavItems(currentLink).flat();
    const firstBreadcrumb = await getTopBreadcrumb();
    if (firstBreadcrumb) {
      linkTrail.push(firstBreadcrumb);
    }

    linkTrail.reverse();
    const breadCrumbs = document.createElement('div');
    breadCrumbs.classList.add('breadCrumbs');
    for (const link of linkTrail) {
      const breadCrumbLink = link.href
        ? document.createElement('a')
        : document.createElement('span');
      if (link.href) {
        breadCrumbLink.setAttribute('href', link.href);
      }
      breadCrumbLink.setAttribute('class', 'crumb');
      breadCrumbLink.textContent = link.text;
      breadCrumbs.appendChild(breadCrumbLink);
    }
    document.querySelector('#navbarLeft').appendChild(breadCrumbs);
  }
}

function isHidden(element) {
  return element.offsetParent === null;
}

function addHashLinks() {
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
    if (!isHidden(title) && index !== 0) {
      const id = generateId(title);
      if (!document.getElementById(id)) {
        title.setAttribute('id', id);
      }

      const hashLink = document.createElement('a');
      hashLink.setAttribute('href', `#${id}`);
      hashLink.setAttribute('title', 'Direct link to heading');
      hashLink.setAttribute('class', 'hashLink');

      title.appendChild(hashLink);
    }
  });

  const idFromUrl = window.location.href.split('#').at(-1);
  if (idFromUrl && idsInDoc.includes(idFromUrl)) {
    document.getElementById(idFromUrl).scrollIntoView({ behavior: 'smooth' });
  }
}

function createNavLink(isPrevious, linkObject) {
  const navLink = document.createElement('a');
  navLink.classList.add('navbarButton');
  navLink.classList.add('navLink');
  navLink.classList.add(isPrevious ? 'previous' : 'next');
  if (linkObject) {
    navLink.setAttribute('href', linkObject.getAttribute('href'));
  } else {
    navLink.classList.add('disabled');
  }
  const title = linkObject ? linkObject.innerText : 'None';
  const titleLabel = `${
    isPrevious ? 'Previous topic' : 'Next topic'
  }: ${title}`;
  navLink.setAttribute('title', titleLabel);
  navLink.setAttribute('aria-label', titleLabel);
  navLink.setAttribute('rel', isPrevious ? 'prev' : 'next');
  navLink.setAttribute('tabindex', 0);

  return navLink;
}

function addNavigationLinks() {
  const flatLinkList = document.querySelectorAll('nav[role="toc"] a');
  const currentLink = getCurrentLink();
  let matchingIndex = undefined;
  flatLinkList.forEach((link, index) => {
    if (link === currentLink) {
      matchingIndex = index;
    }
  });

  const previousLink = createNavLink(true, flatLinkList[matchingIndex - 1]);
  const nextLink = createNavLink(false, flatLinkList[matchingIndex + 1]);

  const navigationLinks = document.createElement('div');
  navigationLinks.classList.add('navLinks');
  navigationLinks.appendChild(previousLink);
  navigationLinks.appendChild(nextLink);

  document.querySelector('#navbarRight').appendChild(navigationLinks);
}

function addVerticalDivider() {
  const verticalDivider = document.createElement('div');
  verticalDivider.classList.add('verticalDivider');

  document.querySelector('#navbarRight').appendChild(verticalDivider);
}

function removeElementsByQuery(selectedDocument, listOfQueries) {
  for (const query of listOfQueries) {
    const matchedElement = selectedDocument.querySelector(query);
    if (matchedElement) {
      matchedElement.remove();
    }
  }
}

function addPrintButton() {
  const printButton = document.createElement('button');
  printButton.setAttribute('type', 'button');
  printButton.classList.add('navbarButton');
  printButton.classList.add('printButton');
  const title = 'Print this page';
  printButton.setAttribute('title', title);
  printButton.setAttribute('aria-label', title);
  printButton.addEventListener('click', function() {
    window.print();
  });

  document.querySelector('#navbarRight').appendChild(printButton);
}

function addShareButton() {
  const shareButton = document.createElement('a');
  shareButton.classList.add('navbarButton');
  shareButton.classList.add('shareButton');
  shareButton.setAttribute('data-sharer', 'email');
  const title = document.querySelector('title').textContent;
  const label = 'Share this page';
  shareButton.setAttribute('title', label);
  shareButton.setAttribute('aria-label', label);

  shareButton.setAttribute(
    'href',
    `mailto:?subject=${title}&amp;body=Check out Guidewire documentation page ${window.location}`
  );

  document.querySelector('#navbarRight').appendChild(shareButton);
}

function addScrollToTop() {
  const scrollToTopButton = document.createElement('button');
  scrollToTopButton.setAttribute('type', 'button');
  const title = 'Scroll to top';
  scrollToTopButton.setAttribute('title', title);
  scrollToTopButton.setAttribute('aria-label', title);
  scrollToTopButton.classList.add('scrollToTopButton');

  const main = document.querySelector('main');

  scrollToTopButton.addEventListener('click', function() {
    main.scrollTop = 0;
  });

  main.addEventListener('scroll', function() {
    if (main.scrollTop > 100) {
      scrollToTopButton.classList.add('visible');
    } else {
      scrollToTopButton.classList.remove('visible');
    }
  });

  document.querySelector('footer').appendChild(scrollToTopButton);
}

function addNavbar() {
  addNavigationLinks();
  addVerticalDivider();
  addPdfLink();
  addShareButton();
  addPrintButton();
  addHighlightToggle();
  addScrollToTop();
}

export async function addPageNavigators() {
  addHashLinks();
  addMiniToc();
  addNavbar();
  await addBreadCrumbs();
  highlightTextFromUrl();
}
