import { addHashLinks } from './hashLink.js';
import { highlightTextFromUrl, addHighlightToggle } from './highlight.js';
import { addPdfLink } from './pdflink.js';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import '../../stylesheets/modules/minitoc.css';

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
  return document.querySelector('nav[role="toc"] a.current')
    ? document.querySelector('nav[role="toc"] a.current')
    : document.querySelector('nav.toc a.current');
}

function getDocTitleBreadcrumb() {
  const docTitle = document.querySelector("meta[name='gw-doc-title']")?.content;
  const docBaseUrl = document.querySelector("meta[name='gw-base-url']")
    ?.content;

  if (!docTitle || !docBaseUrl) {
    return;
  }

  const docTitleBreadcrumb = {
    text: docTitle,
    href: docBaseUrl,
  };

  return docTitleBreadcrumb;
}

async function addBreadCrumbs() {
  let currentLink = getCurrentLink();
  if (currentLink) {
    const linkTrail = getParentNavItems(currentLink).flat();

    const docTitleBreadcrumb = getDocTitleBreadcrumb();
    if (docTitleBreadcrumb) {
      linkTrail.push(docTitleBreadcrumb);
    }
    const topBreadcrumb = await getTopBreadcrumb();
    if (topBreadcrumb) {
      linkTrail.push(topBreadcrumb);
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
    document.querySelector('#navbarLeft').prepend(breadCrumbs);
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
  const flatLinkList =
    document.querySelectorAll("nav[role='toc'] a").length > 0
      ? document.querySelectorAll("nav[role='toc'] a")
      : document.querySelectorAll('nav.toc a');
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

  navigationLinks.addEventListener('click', e => {
    if (e.target.matches('a')) {
      const toc = document.querySelector('nav[role="toc"]')
        ? document.querySelector('nav[role="toc"]')
        : document.querySelector('nav.toc');
      sessionStorage.setItem('tocPos', toc.scrollTop);
      const navUls = toc.querySelectorAll('li > ul');
      let expandedUls = [];
      navUls.forEach((nestedList, index) => {
        if (!nestedList.classList.contains('expanded')) {
          return;
        } else {
          expandedUls.push(index);
        }
      });
      sessionStorage.setItem('tocExpandedItems', expandedUls);
    }
  });
  document.querySelector('#navbarRight').appendChild(navigationLinks);
}

function addVerticalDivider() {
  const verticalDivider = document.createElement('div');
  verticalDivider.classList.add('verticalDivider');

  document.querySelector('#navbarRight').appendChild(verticalDivider);
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
    `mailto:?subject=${title}&body=Check out Guidewire documentation page ${window.location}.`
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

  const html = document.querySelector('html');
  const article = document.querySelector('article');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  scrollToTopButton.addEventListener('click', function() {
    if (!prefersReducedMotion || prefersReducedMotion.matches) {
      html.scrollIntoView();
    } else {
      html.scrollIntoView({ behavior: 'smooth' });
    }
  });

  window.addEventListener('scroll', debounce(handleScroll));

  function handleScroll() {
    // show or hide scrollToTop button
    if (html.scrollTop >= 200) {
      let articleRect = article.getBoundingClientRect();
      scrollToTopButton.style.left = parseInt(articleRect.right + 4) + 'px';
      scrollToTopButton.classList.add('visible');
    } else {
      scrollToTopButton.classList.remove('visible');
    }

    // update miniToc to highlight current section and keep in view
    const hashLinks = document.querySelectorAll('.hashLink');
    if (
      hashLinks.length < 1 ||
      document.querySelector('#mobileMiniTocWrapper')
    ) {
      return;
    }
    const miniToc = document.querySelector('nav.miniToc');
    const links = [...hashLinks];
    let closestToTop = links.reduce((prev, curr) => {
      return Math.abs(prev.getBoundingClientRect().top) <
        Math.abs(curr.getBoundingClientRect().top)
        ? prev
        : curr;
    });

    if (
      closestToTop.getBoundingClientRect().top >
        (window.innerHeight || document.documentElement.clientHeight) &&
      links.indexOf(closestToTop) > 0
    ) {
      closestToTop = links[links.indexOf(closestToTop) - 1];
    }
    const href = closestToTop.getAttribute('href');
    const prevMiniTocLink = miniToc.querySelector('.miniTocLink.current');
    if (prevMiniTocLink) {
      prevMiniTocLink.classList.remove('current');
    }
    const matchingMiniTocLink = miniToc.querySelector(
      `[href='${href}']`,
      '.miniTocLink'
    );
    matchingMiniTocLink.classList.add('current');

    if (
      matchingMiniTocLink.getBoundingClientRect().top >
        parseInt(window.getComputedStyle(miniToc).height) ||
      matchingMiniTocLink.getBoundingClientRect().top < 0
    ) {
      matchingMiniTocLink.scrollIntoView();
    }
  }

  function debounce(fn, delay = 100) {
    let timeout;

    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

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

// miniToc
function LinkList({ links }) {
  return (
    <>
      {links.map((hashLink, key) => {
        const title = hashLink.parentElement.textContent;
        const href = hashLink.getAttribute('href');
        const parentClasses = hashLink.parentElement.classList;
        const applicableClasses = [...parentClasses].filter(
          className => !className.match('^title$')
        );

        if (title && href) {
          return (
            <a
              href={href}
              className={['miniTocLink', ...applicableClasses].join(' ')}
              key={key}
            >
              {title}
            </a>
          );
        }
      })}
    </>
  );
}

function MiniToc({ hashLinks }) {
  const [width, setWidth] = useState(window.innerWidth);
  const [expanded, setExpanded] = useState(false);
  const breakpoint = 1405;
  const miniTocTitle = 'On this page';

  const handleWindowResize = () => setWidth(window.innerWidth);
  useEffect(function() {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  if (width < breakpoint) {
    return (
      <div id="mobileMiniTocWrapper">
        <button
          role="button"
          aria-controls="mobileLinkList"
          aria-expanded={expanded}
          id="miniTocButton"
          className={expanded && 'expanded'}
          onClick={() => setExpanded(!expanded)}
        >
          {miniTocTitle}
        </button>
        {expanded && (
          <div
            id="mobileLinkList"
            role="region"
            aria-labelledby="miniTocButton"
          >
            <LinkList links={[...hashLinks]} />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="miniTocTitle">{miniTocTitle}</div>
      <LinkList links={[...hashLinks]} />
    </>
  );
}

function addMiniToc(hashLinks) {
  const miniTocContainer = document.createElement('nav');
  miniTocContainer.setAttribute('class', 'miniToc');

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    const footer = document.querySelector('footer');
    footer.parentNode.insertBefore(sidebar, footer);
  }

  const main = document.querySelector('main');
  main.prepend(miniTocContainer);
  render(<MiniToc hashLinks={hashLinks} />, miniTocContainer);

  const spacer = document.createElement('div');
  spacer.classList.add('spacer');
  const mainArticle = document.querySelector('article');
  mainArticle.before(spacer);
}

export async function addPageNavigators() {
  await addHashLinks();

  // add minitoc only if hash links have been added
  const hashLinks = document.querySelectorAll('.hashLink');
  if (hashLinks.length > 1) {
    addMiniToc(hashLinks);
    //showPlaceInMiniToc(hashLinks);
  }

  addNavbar();
  await addBreadCrumbs();
  highlightTextFromUrl();
}
