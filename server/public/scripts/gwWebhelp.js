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
    const product = document.querySelector("meta[name = 'gw-product']")[
      'content'
    ];
    const platform = document.querySelector("meta[name = 'gw-platform']")[
      'content'
    ];
    const baseUrl = window.location.protocol + '//' + window.location.host;
    const json = await getConfig();
    const docsFromConfig = json.docs.filter(
      d =>
        d.metadata.product.includes(product) &&
        d.metadata.platform.includes(platform) &&
        d.displayOnLandingPages !== false
    );
    const versions = [];
    docsFromConfig.forEach(doc => {
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

async function getDocRelease() {
  try {
    const product = document.querySelector("meta[name = 'gw-product']")[
      'content'
    ];
    const platform = document.querySelector("meta[name = 'gw-platform']")[
      'content'
    ];
    const version = document.querySelector("meta[name = 'gw-version']")[
      'content'
    ];
    const json = await getConfig();
    const docsFromConfig = json.docs.filter(
      d =>
        d.metadata.product.includes(product) &&
        d.metadata.platform.includes(platform) &&
        d.metadata.version === version &&
        d.displayOnLandingPages !== false
    );
    return docsFromConfig[0].metadata.release[0];
  } catch (err) {
    console.log(err);
  }
}

async function getProductFamilyForProduct() {
  try {
    const product = document.querySelector("meta[name = 'gw-product']")[
      'content'
    ];
    const json = await getConfig();
    const productFamiliesFromConfig = json.productFamilies.filter(pf =>
      pf.product.includes(product)
    );
    return productFamiliesFromConfig[0].productFamilyName;
  } catch (err) {
    console.log(err);
    return { productFamilies: [] };
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
    const product = document.querySelector("meta[name = 'gw-product']")[
      'content'
    ];
    const version = document.querySelector("meta[name = 'gw-version']")[
      'content'
    ];
    const productFamily = await getProductFamilyForProduct();
    const release = await getDocRelease();
    const topLink =
      window.location.protocol +
      '//' +
      window.location.host +
      '/products/' +
      productFamily.toLowerCase().replace(/\W/g, '-') +
      '/' +
      release +
      '/' +
      product +
      '/' +
      version;
    const listItem = document.createElement('li');
    const topicrefSpan = document.createElement('span');
    topicrefSpan.setAttribute('class', 'topicref');
    const titleSpan = document.createElement('span');
    titleSpan.setAttribute('class', 'title');
    const listItemLink = document.createElement('a');
    listItemLink.setAttribute('href', topLink);
    listItemLink.innerText = product + ' ' + version;

    titleSpan.appendChild(listItemLink);
    topicrefSpan.appendChild(titleSpan);
    listItem.appendChild(topicrefSpan);

    function getBreadcrumbs() {
      return document.querySelector('.wh_breadcrumb > .d-print-inline-block');
    }

    let breadcrumbs = getBreadcrumbs();
    while (!breadcrumbs) {
      setTimeout(wait, 100);
      breadcrumbs = getBreadcrumbs();
    }
    if (breadcrumbs) {
      breadcrumbs.prepend(listItem);
    } else {
      console.log('Breadcrumbs not found');
    }
  } catch (err) {
    console.log(err);
    return null;
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
  addTopLinkToBreadcrumbs();
});
