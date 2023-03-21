export async function addBookLinks() {
  const keywords = document.querySelectorAll('cite .keyword');
  if (keywords == null) return;

  let product = window.docProduct;
  let version = window.docVersion;
  
  keywords.forEach(async (keyword, i) => {
    const docTitle = keyword.textContent;
    const citeClassName = keyword.parentElement.className;
    const contextidRegex = /contextid\(([^\)]*)\)/;
    
    let contextid = null;
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
    
    try {
      const response = await fetch(`/safeConfig/docUrl?products=${product}&versions=${version}&title=${docTitle}`);
      if (response.ok) {
        const docInfo = await response.json();
        if (docInfo.error) return;
        let targetUrl = `/${docInfo.url}`;
        const link = document.createElement('a');

        if (contextid) {
          //targetUrl = targetUrl.concat('/?contextId=', contextid);
          const topicUrl = await getTopicUrl(docInfo.url, contextid);
          if (topicUrl) {
            targetUrl = targetUrl.concat(`/${topicUrl}`);
            const topicTitle = await getTopicTitle(targetUrl);
            if (topicTitle) {
              if (document.documentElement.lang.toLowerCase() === 'en-us') {
                link.setAttribute('title', `"${topicTitle}" in the ${docTitle}`);
              }
              else {
                link.setAttribute('title', topicTitle);
              }
            } 
          }
        }

        link.setAttribute('href', targetUrl);
        link.textContent = docTitle;
        keyword.textContent = '';    
        keyword.appendChild(link);
      }
    } catch (err) {
      console.error(err);
    }
  });
}

async function getTopicUrl(url: string, contextid: string) {
  try {
    const response = await fetch(`/${url}/contextIds.json`);
    if (response.ok) {
      const idInfo = await response.json();
      if (idInfo.error) return;
      const id = idInfo.contextIds.find((match: { ids: string | String[]; }) => match.ids.includes(contextid));
      return id.file;
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