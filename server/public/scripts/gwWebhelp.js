async function getConfig() {
  try {
    const configUrl = '/safeConfig';
    const result = await fetch(configUrl);
    return await result.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function findBestMatchingTopic(searchQuery, docProduct, docVersion) {
  try {
    const baseUrl = window.location.protocol + '//' + window.location.host;
    const searchUrl = new URL('/search', baseUrl);
    searchUrl.searchParams.append('rawJSON', 'true');
    searchUrl.searchParams.append('q', `${searchQuery}`);
    searchUrl.searchParams.append('product', `${docProduct}`);
    searchUrl.searchParams.append('version', `${docVersion}`);
    const response = await fetch(searchUrl.href);
    const responseBody = await response.json();
    return responseBody[0]?.href;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getVersions() {
  try {
    const product = document
      .querySelector("meta[name = 'gw-product']")
      ['content'].split(',');
    const platform = document
      .querySelector("meta[name = 'gw-platform']")
      ['content'].split(',');

    const baseUrl = window.location.protocol + '//' + window.location.host;
    const json = await getConfig();
    const docsFromConfig = json.docs.filter(
      d =>
        d.metadata.product.some(p => product.includes(p)) &&
        d.metadata.platform.some(pl => platform.includes(pl)) &&
        d.displayOnLandingPages !== false
    );

    const versions = [];
    for (doc of docsFromConfig) {
      const sameVersionDocs = docsFromConfig.filter(d =>
        d.metadata.version.some(dd => doc.metadata.version.includes(dd))
      );
      const docVersion = doc.metadata.version[0];
      if (sameVersionDocs.length > 1) {
        //FIXME
        const productVersionPageUrl = sameVersionDocs[0].url;
        if (!versions.some(ver => ver.link === productVersionPageUrl)) {
          versions.push({
            label: docVersion,
            link: productVersionPageUrl,
          });
        }
      } else {
        if (doc.url.includes('portal2')) {
          versions.push({
            label: docVersion,
            link: doc.url,
            public: doc.public,
          });
        } else {
          versions.push({
            label: docVersion,
            link: baseUrl + '/' + doc.url,
            public: doc.public,
          });
        }
      }
    }

    versions
      .sort((a, b) =>
        a.label
          .replace(/\d+/g, n => +n + 100)
          .localeCompare(b.label.replace(/\d+/g, n => +n + 100))
      )
      .reverse();

    return versions;
  } catch (err) {
    console.log(err);
    return { docs: [] };
  }
}

function createContainerForCustomHeaderElements() {
  const container = document.createElement('div');
  container.setAttribute('id', 'customHeaderElements');
  document
    .getElementById('wh_top_menu_and_indexterms_link')
    .appendChild(container);
}

async function createVersionSelector() {
  try {
    const docProduct = document.querySelector("meta[name = 'gw-product']")
      ?.content;
    if (!docProduct) {
      return null;
    }

    let docVersions = await getVersions();

    const response = await fetch('/userInformation');
    const responseBody = await response.json();
    const isLoggedIn = responseBody.isLoggedIn;

    if (!isLoggedIn && Array.isArray(docVersions)) {
      docVersions = docVersions.filter(v => v.public);
    }

    if (docVersions.length > 1) {
      const select = document.createElement('select');
      select.id = 'versionSelector';
      select.onchange = async function(e) {
        let linkToOpen = document.getElementById('versionSelector').value;
        const isTopic = document.querySelector("meta[name = 'wh-toc-id']");
        if (isTopic) {
          const topicTitle = document.querySelector('head > title')
            ?.textContent;
          const topicDesc = document.querySelector("meta[name = 'description']")
            ?.content;
          const docVersion = e.target.options[e.target.selectedIndex].innerHTML;
          const searchQuery = [topicTitle, topicDesc].filter(Boolean).join(' ');
          const bestMatchingTopic = await findBestMatchingTopic(
            searchQuery,
            docProduct,
            docVersion
          );
          if (bestMatchingTopic) {
            linkToOpen = bestMatchingTopic;
          }
        }
        window.location.assign(linkToOpen);
      };

      for (const val of docVersions) {
        const option = document.createElement('option');
        option.text = val.label;
        option.value = val.link;

        const currentVersion = document
          .querySelector("meta[name = 'gw-version']")
          ['content'].split(',');
        if (currentVersion.includes(option.text)) {
          option.setAttribute('selected', 'selected');
        }
        select.appendChild(option);
      }

      const label = document.createElement('label');
      label.innerHTML = 'Select version:';
      label.htmlFor = 'versionSelector';

      document
        .getElementById('customHeaderElements')
        .appendChild(label)
        .appendChild(select);
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function addTopLinkToBreadcrumbs() {
  try {
    const product = document
      .querySelector("meta[name = 'gw-product']")
      ['content']?.split(',')[0];
    const version = document
      .querySelector("meta[name = 'gw-version']")
      ['content']?.split(',')[0];
    const breadcrumbsMappingUrl =
      window.location.protocol +
      '//' +
      window.location.host +
      '/' +
      'breadcrumbs.json';
    const result = await fetch(breadcrumbsMappingUrl);
    const breadcrumbsMapping = await result.json();
    const currentPagePathname = window.location.pathname;
    for (breadcrumb of breadcrumbsMapping) {
      if (
        currentPagePathname.startsWith(breadcrumb.docUrl) &&
        breadcrumb.rootPages.length() === 1
      ) {
        const productVersionPageUrl = breadcrumb.rootPages[0].path;
        const listItem = document.createElement('li');
        const topicrefSpan = document.createElement('span');
        topicrefSpan.setAttribute('class', 'topicref');
        const titleSpan = document.createElement('span');
        titleSpan.setAttribute('class', 'title');
        const listItemLink = document.createElement('a');
        listItemLink.setAttribute('href', productVersionPageUrl);
        listItemLink.innerText = product + ' ' + version;

        titleSpan.appendChild(listItemLink);
        topicrefSpan.appendChild(titleSpan);
        listItem.appendChild(topicrefSpan);

        function getBreadcrumbs() {
          try {
            let breadcrumbs = document.querySelector(
              '.wh_breadcrumb > .d-print-inline-block'
            );
            if (!breadcrumbs) {
              window.requestAnimationFrame(getBreadcrumbs);
            } else {
              breadcrumbs.prepend(listItem);
            }
          } catch (err) {
            console.log(err);
            return null;
          }
        }

        getBreadcrumbs();
      }
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function addPublicationDate() {
  const pathToRoot = document.querySelector("meta[name = 'wh-path2root']")[
    'content'
  ];
  if (pathToRoot) {
    const rootUrl = pathToRoot + 'index.html';
    const result = await fetch(rootUrl);
    const parser = new DOMParser();
    const rootDoc = parser.parseFromString(await result.text(), 'text/html');
    const footerDate = rootDoc.querySelector("span[class = 'footerDate']");
    const footerLink = document.querySelector("span[class = 'footerLink']");
    footerLink.parentNode.insertBefore(footerDate, footerLink);
  }
}

async function addLoginLogoutButton() {
  const response = await fetch('/userInformation');
  const responseBody = await response.json();
  const isLoggedIn = responseBody.isLoggedIn;
  const buttonWrapper = document.createElement('div');
  buttonWrapper.setAttribute('class', 'loginLogoutButtonWrapper');
  const buttonTemplate = document.createElement('a');
  buttonTemplate.setAttribute('class', 'gwButtonSecondary loginButtonSmall');
  if (isLoggedIn) {
    buttonTemplate.setAttribute('href', '/gw-logout');
    buttonTemplate.innerText = 'Log out';
  } else {
    buttonTemplate.setAttribute('href', '/gw-login');
    buttonTemplate.innerText = 'Log in';
  }
  document
    .getElementById('customHeaderElements')
    .appendChild(buttonWrapper)
    .appendChild(buttonTemplate);
}

function docReady(fn) {
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function hideByCssClass(cssClass) {
  const el = document.getElementsByClassName(cssClass)[0];
  if (el) {
    el.style.display = 'none';
  }
}

docReady(async function() {
  createContainerForCustomHeaderElements();
  addTopLinkToBreadcrumbs();
  addPublicationDate();
  await createVersionSelector();
  addLoginLogoutButton();
  if (isInIframe()) {
    hideByCssClass('wh_header');
    hideByCssClass('wh_footer');
  }
});
