import { setMetadata } from './modules/metadata.js';

function selectToggleButton() {
  const toggleButtons = document.querySelectorAll(
    '#platformToggle > .toggleButton'
  );
  if (toggleButtons.length === 0) {
    return;
  }
  let matchingButton = document.querySelector('#platformToggle > #cloudButton');
  const currentPath = window.location.pathname;
  toggleButtons.forEach((button) => {
    const root = button.getAttribute('data-root');
    if (currentPath.startsWith(root)) {
      matchingButton = button;
    }
  });
  // temporary patch
  if (currentPath.startsWith('/globalSolutions/ipf/')) {
    matchingButton = document.querySelector(
      '#platformToggle > #selfManagedButton'
    );
  }
  matchingButton.classList.toggle('selected');
  matchingButton.removeAttribute('href');
}

async function addReleaseBadge() {
  const cloudReleaseMatch = window.location.href.match(
    /\/cloudProducts\/([^/]+)(\/|$)/
  );

  if (cloudReleaseMatch) {
    const releaseName = cloudReleaseMatch[1];
    const p = document.createElement('p');
    p.innerHTML = `${
      releaseName.charAt(0).toUpperCase() + releaseName.slice(1)
    } Release`;

    const div = document.createElement('div');
    div.setAttribute('class', 'releaseInfo');

    const imgHref = `/images/badge-${releaseName}.svg`;
    const imgRequest = await fetch(imgHref);
    if (imgRequest.ok) {
      const img = document.createElement('img');
      img.setAttribute('src', imgHref);
      img.setAttribute('alt', '');
      img.setAttribute('height', '24px');
      img.setAttribute('width', '24px');
      div.appendChild(img);
    }

    div.appendChild(p);

    const footerRight = document.querySelector('#footerRight');
    if (footerRight) {
      footerRight.appendChild(div);
    }
  }
}

function setSearchFilterCSS() {
  if (window.location.pathname.startsWith('/search')) {
    const header = document.querySelector('.header-search');
    const filter = document.querySelector('.filterSearchResults');
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const headerPaddingTop = window
          .getComputedStyle(header)
          .getPropertyValue('padding-top');
        const headerPaddingBottom = window
          .getComputedStyle(header)
          .getPropertyValue('padding-bottom');
        let headerContentSize;
        if (entry.contentBoxSize) {
          headerContentSize = entry.contentBoxSize[0].blockSize + 'px';
        } else {
          headerContentSize = entry.contentRect[0].height + 'px';
        }
        filter.style.top =
          'calc(' +
          headerContentSize +
          ' + ' +
          headerPaddingTop +
          ' + ' +
          headerPaddingBottom +
          ')';
        filter.style.height =
          'calc(100% - ' +
          headerContentSize +
          ' - ' +
          headerPaddingTop +
          ' - ' +
          headerPaddingBottom +
          ')';
      }
    });
    resizeObserver.observe(header);
  }
}

window.onload = async function () {
  addReleaseBadge();
  setSearchFilterCSS();
  await setMetadata();
};
