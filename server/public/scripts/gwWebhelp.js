async function findBestMatchingTopic(searchQuery, docProduct, docVersion) {
  try {
    const baseUrl = window.location.protocol + '//' + window.location.host;
    const searchUrl = new URL('/search', baseUrl);
    searchUrl.searchParams.append('rawJSON', 'true');
    searchUrl.searchParams.append('q', `${searchQuery}`);
    searchUrl.searchParams.append('product', `${docProduct}`);
    searchUrl.searchParams.append('version', `${docVersion}`);
    const response = await fetch(searchUrl);
    const responseBody = await response.json();
    return responseBody[0]?.href;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getConfig() {
  try {
    const configUrl = '/portal-config/config.json';
    const result = await fetch(configUrl);
    return await result.json();
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
    docsFromConfig.forEach(doc => {
      const sameVersionDocs = docsFromConfig.filter(
        d => d.metadata.version === doc.metadata.version
      );
      if (sameVersionDocs.length > 1) {
        const productVersionPageUrl =
          baseUrl +
          '/' +
          'product' +
          '/' +
          product[0].toLowerCase().replace(/\W/g, '-') +
          '/' +
          doc.metadata.version;
        if (!versions.some(ver => ver.link === productVersionPageUrl)) {
          versions.push({
            label: doc.metadata.version,
            link: productVersionPageUrl,
          });
        }
      } else {
        if (doc.url.includes('portal2')) {
          versions.push({
            label: doc.metadata.version,
            link: doc.url,
          });
        } else {
          versions.push({
            label: doc.metadata.version,
            link: baseUrl + '/' + doc.url,
          });
        }
      }
    });

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

async function createVersionSelector() {
  try {
    const docProduct = document.querySelector("meta[name = 'gw-product']")
      ?.content;
    if (!docProduct) {
      return null;
    }

    const docVersions = await getVersions();

    if (docVersions.length > 1) {
      const select = document.createElement('select');
      select.id = 'versionSelector';
      select.onchange = async function(e) {
        let linkToOpen = document.getElementById('versionSelector').value;
        const topicTitle = document.querySelector('head > title')?.textContent;
        const topicDesc = document.querySelector("meta[name = 'description']")
          ?.content;
        const docVersion = e.target.options[e.target.selectedIndex].innerHTML;
        const searchQuery = `${topicTitle} ${topicDesc}`;
        const bestMatchingTopic = await findBestMatchingTopic(
          searchQuery,
          docProduct,
          docVersion
        );
        if (bestMatchingTopic) {
          linkToOpen = bestMatchingTopic;
        }
        window.location.assign(linkToOpen);
      };

      for (const val of docVersions) {
        const option = document.createElement('option');
        option.text = val.label;
        option.value = val.link;

        const currentVersion = document.querySelector(
          "meta[name = 'gw-version']"
        )['content'];
        if (currentVersion && option.text === currentVersion) {
          option.setAttribute('selected', 'selected');
        }
        select.appendChild(option);
      }

      const label = document.createElement('label');
      label.innerHTML = 'Select version:';
      label.htmlFor = 'versionSelector';

      document
        .getElementById('wh_top_menu_and_indexterms_link')
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
    const platform = document
      .querySelector("meta[name = 'gw-platform']")
      ['content']?.split(',')[0];
    const version = document.querySelector("meta[name = 'gw-version']")[
      'content'
    ];
    const baseUrl = window.location.protocol + '//' + window.location.host;
    const json = await getConfig();
    const sameVersionDocs = json.docs.filter(
      d =>
        d.metadata.product.includes(product) &&
        d.metadata.platform.includes(platform) &&
        d.metadata.version === version &&
        d.displayOnLandingPages !== false
    );
    if (sameVersionDocs.length > 1) {
      const productVersionPageUrl =
        baseUrl +
        '/' +
        'product' +
        '/' +
        product.toLowerCase().replace(/\W/g, '-') +
        '/' +
        version;
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

docReady(async function() {
  await createVersionSelector();
  await addTopLinkToBreadcrumbs();
  await addPublicationDate();
});
