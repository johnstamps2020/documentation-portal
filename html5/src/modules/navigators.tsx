import { translate } from '@doctools/core';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../stylesheets/modules/minitoc.css';
import { addHashLinks } from './hashLink';
import { addHighlightButton } from './highlight';
import { addPdfLink } from './pdflink';

async function getLanguageBreadcrumb() {
  if (!window.docLanguage || window.docLanguage === 'en') {
    return;
  }
  const languageData = [
    {
      key: 'de',
      label: 'Deutsch',
      href: '/l10n/de-DE',
    },
    {
      key: 'es',
      label: 'Español',
      href: '/l10n/es-419',
    },
    {
      key: 'es-es',
      label: 'Español (España)',
      href: '/l10n/es-ES',
    },
    {
      key: 'fr',
      label: 'Francais',
      href: '/l10n/fr-FR',
    },
    {
      key: 'it',
      label: 'Italiano',
      href: '/l10n/it-IT',
    },
    {
      key: 'ja',
      label: '日本語',
      href: '/l10n/ja-JP',
    },
    {
      key: 'nl',
      label: 'Nederlands',
      href: '/l10n/nl-NL',
    },
    {
      key: 'pt',
      label: 'Português',
      href: '/l10n/pt-BR',
    },
  ];

  const matchingLanguage = languageData.find(
    (lang) => lang.key === window.docLanguage
  );
  if (!matchingLanguage) {
    return;
  }
  return {
    text: matchingLanguage.label,
    href: matchingLanguage.href,
  };
}

async function getPlatformBreadcrumb() {
  const valueSeparator = ',';
  if (!window.docPlatform) {
    return;
  }
  const platform = window.docPlatform.split(valueSeparator);

  if (platform.includes('Cloud')) {
    const release = window.docRelease?.split(valueSeparator) || [];

    const latestPageReleases =
      sessionStorage
        .getItem('latestLandingPageReleases')
        ?.split(valueSeparator) || [];
    // Can't find any release data for doc or latest landing page and doc is only for Cloud.
    if (
      release.length === 0 &&
      latestPageReleases.length === 0 &&
      platform.length === 1
    ) {
      return {
        text: 'Cloud',
        href: '/cloudProducts',
      };
    }
    // Doc has multiple releases. Use release value from session if we can.
    if (release.length > 1) {
      if (latestPageReleases.length === 1) {
        return {
          text: latestPageReleases[0],
          href: `/cloudProducts/${latestPageReleases[0]
            .toLowerCase()
            .replace(' ', '')
            .replace('ñ', 'n')}`,
        };
      }
      if (platform.includes('Self-managed')) {
        return {
          text: 'Self-managed',
          href: '/selfManagedProducts',
        };
      }
    }

    if (release.length === 1) {
      return {
        text: release[0],
        href: `/cloudProducts/${release[0]
          .toLowerCase()
          .replace(' ', '')
          .replace('ñ', 'n')}`,
      };
    }
  }
  if (platform[0] === 'Self-managed') {
    return {
      text: 'Self-managed',
      href: '/selfManagedProducts',
    };
  }
}

async function getTopBreadcrumb() {
  type RootPageObject = {
    label: string;
    path: string;
  };
  try {
    const currentPagePathname = window.location.pathname;
    const response = await fetch(
      `/safeConfig/breadcrumbs?pagePathname=${currentPagePathname}`
    );
    const jsonResponse = await response.json();
    const rootPageObjects = jsonResponse.rootPages;

    if (rootPageObjects.length === 0) return null;

    // if only one possible root page is found, use it. If we wait and depend
    // on session data, the crumb will not be found if the session data does
    // not exist, such as if a user goes directly to a doc without hitting a
    // landing page first.
    if (rootPageObjects.length === 1 && rootPageObjects[0]) {
      if (rootPageObjects[0].path.charAt(0) !== '/') {
        rootPageObjects[0].path = '/' + rootPageObjects[0].path;
      }
      return {
        text: rootPageObjects[0].label,
        href: rootPageObjects[0].path,
      };
    }

    const latestLandingPage = sessionStorage.getItem('latestLandingPagePath');
    if (!latestLandingPage) return null;

    const matchingRootPage = rootPageObjects.filter((rpo: RootPageObject) => {
      return rpo && rpo.path === latestLandingPage;
    });

    if (matchingRootPage.length === 1) {
      if (matchingRootPage[0].path.charAt(0) !== '/') {
        matchingRootPage[0].path = '/' + matchingRootPage[0].path;
      }
      return {
        text: matchingRootPage[0].label,
        href: matchingRootPage[0].path,
      };
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function getParentNavItems(
  linkElement: Element
): { text: string; href: string }[] {
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

  return allLinks.flat();
}

function getCurrentLink() {
  return (
    document.querySelector('nav[role="toc"] a.current') ||
    document.querySelector('nav.toc a.current')
  );
}

function getDocTitleBreadcrumb() {
  let docTitle =
    window.docDisplayTitle?.length > 0
      ? window.docDisplayTitle
      : window.docTitle;

  if (!docTitle) {
    docTitle = document
      .querySelector("meta[name='gw-doc-title']")
      ?.getAttribute('content');
  }

  const docBaseUrl = document
    .querySelector("meta[name='gw-base-url']")
    ?.getAttribute('content');

  if (!docTitle || !docBaseUrl) {
    return;
  }

  if (docTitle.startsWith('"') && docTitle.endsWith('"')) {
    docTitle = docTitle.replace(/"/g, '');
  }

  return {
    text: docTitle,
    href: docBaseUrl,
  };
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

    const languageBreadcrumb = await getLanguageBreadcrumb();

    if (languageBreadcrumb) {
      if (topBreadcrumb && topBreadcrumb.href !== languageBreadcrumb.href) {
        linkTrail.push(languageBreadcrumb);
      }
    } else {
      const platformBreadcrumb = await getPlatformBreadcrumb();
      if (platformBreadcrumb) {
        if (topBreadcrumb && topBreadcrumb.href !== platformBreadcrumb.href) {
          linkTrail.push(platformBreadcrumb);
        }
      }
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

function createNavLink(isPrevious: boolean, linkObject: Element) {
  const navLink = document.createElement('a');
  navLink.classList.add('navbarButton');
  navLink.classList.add('navLink');
  navLink.classList.add(isPrevious ? 'previous' : 'next');
  if (linkObject) {
    navLink.setAttribute('href', linkObject.getAttribute('href'));
  } else {
    navLink.classList.add('disabled');
  }
  const noneText = translate({
    id: 'navbar.noNextOrPrevTopic',
    message: 'None',
  });
  const title = linkObject ? linkObject.textContent : noneText;
  const prevTopicLabel = translate({
    id: 'navbar.prevTopic',
    message: 'Previous topic',
  });
  const nextTopicLabel = translate({
    id: 'navbar.nextTopic',
    message: 'Next topic',
  });
  const titleLabel = `${
    isPrevious ? prevTopicLabel : nextTopicLabel
  }: ${title}`;
  navLink.setAttribute('title', titleLabel);
  navLink.setAttribute('aria-label', titleLabel);
  navLink.setAttribute('rel', isPrevious ? 'prev' : 'next');
  navLink.setAttribute('tabindex', '0');

  return navLink;
}

function addNavigationLinks() {
  const flatLinkList =
    document.querySelectorAll("nav[role='toc'] a").length > 0
      ? document.querySelectorAll("nav[role='toc'] a")
      : document.querySelectorAll('nav.toc a');
  const currentLink = getCurrentLink();
  let matchingIndex = 0;
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

  navigationLinks.addEventListener('click', (e) => {
    if ((e.target as Element).matches('a')) {
      const toc =
        document.querySelector('nav[role="toc"]') ||
        document.querySelector('nav.toc');
      sessionStorage.setItem('tocPos', toc.scrollTop.toString());
      const navUls = toc.querySelectorAll('li > ul');
      let expandedUls: string[] = [];
      navUls.forEach((nestedList, index) => {
        if (!nestedList.classList.contains('expanded')) {
          return;
        } else {
          expandedUls.push(index.toString());
        }
      });
      sessionStorage.setItem('tocExpandedItems', expandedUls.join(','));
    }
  });
  document.querySelector('#navbarRight')?.appendChild(navigationLinks);
}

function addVerticalDivider() {
  const verticalDivider = document.createElement('div');
  verticalDivider.classList.add('verticalDivider');

  document.querySelector('#navbarRight')?.appendChild(verticalDivider);
}

function addPrintButton() {
  const printButton = document.createElement('button');
  printButton.setAttribute('type', 'button');
  printButton.classList.add('navbarButton');
  printButton.classList.add('printButton');
  const title = translate({
    id: 'navbar.printThisPage',
    message: 'Print this page',
  });

  printButton.setAttribute('title', title);
  printButton.setAttribute('aria-label', title);
  printButton.addEventListener('click', function () {
    window.print();
  });

  document.querySelector('#navbarRight')?.appendChild(printButton);
}

function addScrollToTop() {
  const scrollToTopButton = document.createElement('button');
  scrollToTopButton.setAttribute('type', 'button');
  const title = translate({
    id: 'nav.scrollToTop',
    message: 'Scroll to top',
  });
  scrollToTopButton.setAttribute('title', title);
  scrollToTopButton.setAttribute('aria-label', title);
  scrollToTopButton.classList.add('scrollToTopButton');

  const html = document.querySelector('html');
  const article = document.querySelector('article');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  scrollToTopButton.addEventListener('click', function () {
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
      scrollToTopButton.style.left = `${articleRect.right + 4}px`;
      scrollToTopButton.classList.add('visible');
    } else {
      scrollToTopButton.classList.remove('visible');
    }

    const hashLinks = document.querySelectorAll('.hashLink');
    if (
      hashLinks.length < 1 ||
      document.querySelector('#mobileMiniTocWrapper')
    ) {
      return;
    }
    const links = Array.from(hashLinks);

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

    const miniToc = document.querySelector('nav.miniToc');
    if (!miniToc) {
      return;
    }
    const prevMiniTocLink = miniToc.querySelector('.miniTocLink.current');
    if (prevMiniTocLink) {
      prevMiniTocLink.classList.remove('current');
    }
    const matchingMiniTocLink = miniToc.querySelector(
      `a.miniTocLink[href='${href}']`
    );
    matchingMiniTocLink.classList.add('current');

    if (!prefersReducedMotion || prefersReducedMotion.matches) {
      matchingMiniTocLink.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'start',
      });
    } else {
      matchingMiniTocLink.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }

  function debounce<F extends (...params: any[]) => void>(
    fn: F,
    delay: number = 200
  ) {
    let timeoutID: number = null;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutID);
      timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
    } as F;
  }

  document.querySelector('footer').appendChild(scrollToTopButton);
}

function addNavbar() {
  addNavigationLinks();
  addVerticalDivider();
  addPdfLink();
  addPrintButton();
  addHighlightButton();
  addScrollToTop();
}

type LinkListProps = {
  links: Element[];
};

// miniToc
function LinkList({ links }: LinkListProps) {
  return (
    <>
      {links.map((hashLink, key) => {
        const title = hashLink.parentElement.textContent;
        const href = hashLink.getAttribute('href');
        const parentClasses = hashLink.parentElement.classList;
        const applicableClasses = Array.from(parentClasses).filter(
          (className) => !className.match('^title$')
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

type MiniTocProps = {
  hashLinks: Element[];
};

function MiniToc({ hashLinks }: MiniTocProps) {
  // TO DO: Debug this function
  const [width, setWidth] = useState(window.innerWidth);
  const [expanded, setExpanded] = useState(false);
  const breakpoint = 1496;

  const miniTocTitle = translate({
    id: 'miniToc.heading',
    message: 'On this page',
  });

  const handleWindowResize = () => setWidth(window.innerWidth);
  useEffect(function () {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  if (width <= breakpoint) {
    return (
      <div id="mobileMiniTocWrapper">
        <button
          role="button"
          aria-controls="mobileLinkList"
          aria-expanded={expanded}
          id="miniTocButton"
          className={expanded ? 'expanded' : undefined}
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

function addMiniToc(hashLinks: Element[]) {
  const miniTocContainer = document.createElement('nav');
  miniTocContainer.setAttribute('class', 'miniToc');

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    const footer = document.querySelector('footer');
    footer.parentNode.insertBefore(sidebar, footer);
  }

  const main = document.querySelector('main');
  main.prepend(miniTocContainer);
  const miniTocRoot = createRoot(miniTocContainer);
  miniTocRoot.render(<MiniToc hashLinks={hashLinks} />);

  const spacer = document.createElement('div');
  spacer.classList.add('spacer');
  const mainArticle = document.querySelector('article');
  mainArticle.before(spacer);
}

export async function addPageNavigators(isOffline: boolean) {
  await addHashLinks();

  // add minitoc only if hash links have been added and at least one is not flagged minitoc(no) - DOCT-604
  const hashLinks = document.querySelectorAll('.hashLink');
  const filteredHashLinks = Array.from(hashLinks).filter((link) => {
    const parent = link.parentElement;
    return !parent.classList.contains('minitoc(no)');
  });
  if (filteredHashLinks.length > 0) {
    addMiniToc(Array.from(filteredHashLinks));
    //showPlaceInMiniToc(hashLinks);
  }

  addNavbar();
  !isOffline && (await addBreadCrumbs());
}
