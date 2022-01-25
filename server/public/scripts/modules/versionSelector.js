export async function addVersionSelector() {
  try {
    const matchingVersionSelector = window.matchingVersionSelector;
    if (matchingVersionSelector?.otherVersions?.length > 0) {
      const currentlySelectedVersion = {
        label: matchingVersionSelector.version,
        currentlySelected: true,
      };
      const allVersions = [
        currentlySelectedVersion,
        ...matchingVersionSelector.otherVersions,
      ];
      const sortedVersions = allVersions
        .sort(function(a, b) {
          const verNum = label =>
            label
              .split('.')
              .map(n => +n + 100000)
              .join('.');
          const verNumA = verNum(a.label);
          const verNumB = verNum(b.label);
          let comparison = 0;
          if (verNumA > verNumB) {
            comparison = 1;
          } else if (verNumA < verNumB) {
            comparison = -1;
          }
          return comparison;
        })
        .reverse();
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
          const targetDocVersion =
            e.target.options[e.target.selectedIndex].innerHTML;
          const searchQuery = [topicTitle, topicDesc].filter(Boolean).join(' ');
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

      for (const val of sortedVersions) {
        const option = document.createElement('option');
        option.text = val.label;
        const value = val.fallbackPaths ? val.fallbackPaths[0] : val.path;
        if (value) {
          option.value = value;
        }
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
