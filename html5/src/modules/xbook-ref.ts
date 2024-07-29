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
        let targetUrl = `/${docInfo.url}/`;
        link = document.createElement('a');

        if (contextid) {
          let topicTitle: string;

          let topicUrl = await getDITATopicUrl(docInfo.url, contextid);
          if (topicUrl) {
            targetUrl = targetUrl.concat(`${topicUrl}#${contextid}`);
            topicTitle = await getTopicTitle(targetUrl);
          } else {
            const targetTestUrl = targetUrl.concat(`${contextid}/`);
            topicTitle = await getTopicTitle(targetTestUrl);
            if (topicTitle) {
              targetUrl = targetTestUrl;
            } else {
              topicTitle = await getTopicTitle(targetUrl);
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
      if (window.location.hostname === 'localhost') {
        console.error(err);
      }
    }
  }
  return link;
}

interface ContextIdMatch {
  ids: string[];
  file: string;
}

interface IdInfo {
  contextIds: ContextIdMatch[];
  error?: string;
}

const contextIdCache: { [url: string]: IdInfo } = {};

async function getDITATopicUrl(
  url: string,
  contextid: string
): Promise<string | undefined> {
  try {
    if (contextIdCache[url] !== undefined) {
      const idInfo = contextIdCache[url];
      if (idInfo === null) {
        return;
      }
      const id = idInfo.contextIds.find((match) =>
        match.ids.includes(contextid)
      );
      if (id) {
        return id.file;
      }
      return;
    }
    const response = await fetch(`/${url}/contextIds.json`);
    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (!contentType.includes('application/json')) {
        return;
      }
      const idInfo: IdInfo = await response.json();
      if (idInfo.error) return;
      contextIdCache[url] = idInfo;
      const id = idInfo.contextIds.find((match: { ids: string | String[] }) =>
        match.ids.includes(contextid)
      );
      if (id) {
        return id.file;
      }
      return;
    } else if (response.status === 404) {
      contextIdCache[url] = null;
    }
  } catch (err) {
    if (window.location.hostname === 'localhost') {
      console.error(err);
    }
  }
  return;
}

async function getTopic(url: string) {
  try {
    const response = await fetch(url);
    if (response.ok && !response.redirected) {
      const responseText = await response.text();
      const doc = new DOMParser().parseFromString(responseText, 'text/html');
      if (doc) {
        return doc;
      }
      return;
    }
  } catch (err) {
    if (window.location.hostname === 'localhost') {
      console.error(err);
    }
  }
  return;
}

async function getTopicTitle(url: string): Promise<string | undefined> {
  try {
    const urlWithoutAnchor = url.split('#')[0];
    const encodedUrl = encodeURIComponent(urlWithoutAnchor);

    const response = await fetch(
      `/safeConfig/getTopicTitleByHref/${encodedUrl}`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.title) {
        return data.title;
      } else {
        throw new Error('Title not found in the response');
      }
    } else if (response.status === 404) {
      const topic: Document = await getTopic(url);
      if (topic?.title) {
        return topic.title;
      }
    }
  } catch (err) {
    if (window.location.hostname === 'localhost') {
      console.error(err);
    }
  }

  return undefined;
}
