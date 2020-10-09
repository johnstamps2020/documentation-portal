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

async function getVersions() {
  try {
    const product = document.querySelector("meta[name = 'gw-product']")[
      'content'
    ];
    const platform = document.querySelector("meta[name = 'gw-platform']")[
      'content'
    ];

    const baseUrl = window.location.protocol + '//' + window.location.host;
    const configUrl = '/portal-config/config.json';
    const result = await fetch(configUrl);
    const json = await result.json();
    const docsFromConfig = json.docs.filter(
      d =>
        d.metadata.product.includes(product) &&
        d.metadata.platform.includes(platform) &&
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
          product.toLowerCase().replace(/\W/g, '-') +
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
});
