import '../../stylesheets/modules/versionSelector.css';

async function findBestMatchingTopic(searchQuery, targetDocVersion) {
  try {
    const baseUrl = window.location.protocol + '//' + window.location.host;
    const searchUrl = new URL('/search', baseUrl);
    searchUrl.searchParams.append('rawJSON', 'true');
    searchUrl.searchParams.append('q', `${searchQuery}`);
    searchUrl.searchParams.append('product', `${window.docProduct}`);
    searchUrl.searchParams.append('version', `${targetDocVersion}`);
    if (window.docTitle) {
      searchUrl.searchParams.append('title', `${window.docTitle}`);
    }
    const response = await fetch(searchUrl.href);
    const responseBody = await response.json();
    return responseBody[0]?.href;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function addVersionSelector() {
  try {
    const matchingVersionSelector = window.matchingVersionSelector;
    if (Object.keys(matchingVersionSelector).length > 0) {
      const allVersions = matchingVersionSelector.allVersions;
      const select = document.createElement('select');
      select.id = 'versionSelector';
      select.onchange = async function(e) {
        let linkToOpen = document.getElementById('versionSelector').value;
        const mainElement = document.querySelector('main');
        if (mainElement) {
          const topicContents =
            document.querySelector('article[role="article"]')?.innerText || '';
          const searchQuery = topicContents
            .replace(/[\n\r\t]+|[\s]{2,}/g, ' ')
            .trim()
            .split('. ')[0]; // Split at sentence end. Use "dot + space" to avoid splitting at a version number, e.g. 2022.05.01
          const targetDocVersion =
            e.target.options[e.target.selectedIndex].innerHTML;
          const bestMatchingTopic = await findBestMatchingTopic(
            searchQuery,
            targetDocVersion
          );
          if (bestMatchingTopic) {
            const bestMatchingTopicUrl = new URL(bestMatchingTopic);
            const currentPageUrl = new URL(window.location.href);
            const currentPageHighlightTerms = currentPageUrl.searchParams.get(
              'hl'
            );
            currentPageHighlightTerms &&
              bestMatchingTopicUrl.searchParams.set(
                'hl',
                currentPageHighlightTerms
              );
            linkToOpen = bestMatchingTopicUrl.href;
          }
        }
        window.location.assign(linkToOpen);
      };

      for (const val of allVersions) {
        const option = document.createElement('option');
        option.text = val.versions[0];
        option.label = val.label;
        option.value = `/${val.url}`;
        if (val.currentlySelected) {
          option.setAttribute('selected', 'selected');
        }

        select.appendChild(option);
      }

      const label = document.createElement('label');
      label.innerHTML = 'Select version:';
      label.htmlFor = 'versionSelector';

      document
        .getElementById('headerRight')
        .appendChild(label)
        .appendChild(select);
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
