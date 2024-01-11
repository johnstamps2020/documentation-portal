export async function addBookLinks() {
  const keywords = document.querySelectorAll('cite .keyword');
  if (keywords == null) return;
  const keywordArray = Array.from(keywords);
  for (const keyword of keywordArray) {
    await processKeyword(keyword);
  }
}

async function processKeyword(keyword: Element) {
  const docTitle = keyword.textContent;
  const language = window.docLanguage;
  const citeClassName = keyword.parentElement.className;
  let product = window.docProduct;
  let version = window.docVersion;
  let contextid = null;

  const contextidRegex = /contextid\(([^\)]*)\)/;
  if (contextidRegex.test(citeClassName)) {
    contextid = contextidRegex.exec(citeClassName)[1];
  }

  const productRegex = /product\(([^\)]*)\)/;
  if (productRegex.test(citeClassName)) {
    product = productRegex.exec(citeClassName)[1];
  }
  const versionRegex = /version\(([^\)]*)\)/;
  if (versionRegex.test(citeClassName)) {
    version = versionRegex.exec(citeClassName)[1];
  }

  // if the doc applies to multiple versions, look for matches with latest first
  const versionArray = version.split(',').sort().reverse();
  const link = await findDocLink(
    product,
    versionArray,
    docTitle,
    contextid,
    language
  );

  if (link) {
    keyword.textContent = '';
    keyword.appendChild(link);
  }
}

async function findDocLink(
  product: string,
  versionArray: string[],
  docTitle: string,
  contextid: string,
  language: string
) {
  let link = null;
  for (const version of versionArray) {
    try {
      const response = await fetch(
        `/safeConfig/docUrl?products=${product}&versions=${version}&title=${docTitle}&language=${language}`
      );
      if (response.ok) {
        const docInfo = await response.json();
        if (docInfo.error) return;
        let targetUrl = `/${docInfo.url}`;
        link = document.createElement('a');

        if (contextid) {
          let topicTitle;
          let topicUrl = await getTopicUrl(docInfo.url, contextid);
          if (topicUrl) {
            targetUrl = targetUrl.concat(`/${topicUrl}#${contextid}`);
            topicTitle = await getTopicTitle(targetUrl);
          } else {
            //TODO: The updated redirect causes a minor issue here. If the
            // targetTestUrl is invalid but is within a doc, the root
            // of the doc is returned and we append the contextid as a path.
            // The redirect catches this again and does the right thing.
            // However, the URL in the link is technically incorrect.
            const targetTestUrl = targetUrl.concat(`/${contextid}`);
            topicTitle = await getTopicTitle(targetTestUrl);
            if (topicTitle) {
              targetUrl = targetTestUrl;
            }
          }

          if (topicTitle) {
            if (document.documentElement.lang.toLowerCase().startsWith('en')) {
              link.setAttribute('title', `"${topicTitle}" in ${docTitle}`);
            } else {
              link.setAttribute('title', topicTitle);
            }
          }
        }

        link.setAttribute('href', targetUrl);
        link.textContent = docTitle;
        return link;
      }
    } catch (err) {
      console.error(err);
    }
  }
  return link;
}

async function getTopicUrl(url: string, contextid: string) {
  try {
    const response = await fetch(`/${url}/contextIds.json`);
    if (response.ok) {
      const idInfo = await response.json();
      if (idInfo.error) return;
      const id = idInfo.contextIds.find((match: { ids: string | String[] }) =>
        match.ids.includes(contextid)
      );
      if (id) {
        return id.file;
      }
      return;
      
    }
  } catch (err) {
    console.error(err);
  }
  return;
}

async function getTopicTitle(url: string) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const responseText = await response.text();
      const doc = new DOMParser().parseFromString(responseText, 'text/html');
      return doc.title;
    }
  } catch (err) {
    console.error(err);
  }
  return;
}
