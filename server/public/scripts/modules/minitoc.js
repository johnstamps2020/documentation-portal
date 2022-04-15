import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import '../../stylesheets/modules/minitoc.css';

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
  const breakpoint = 1670;
  const miniTocTitle = 'On this page';

  const handleWindowResize = () => setWidth(window.innerWidth);
  useEffect(function() {
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

export default function addMiniToc(hashLinks) {
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
