export async function addBookLinks() {
  const keywords = document.querySelectorAll('cite .keyword');

  if (keywords == null) return;
  
  keywords.forEach(async (keyword, i) => {
    const docTitle = keyword.textContent;

    try {
      const response = await fetch(`/safeConfig/docUrl?products=${window.docProduct}&versions=${window.docVersion}&title=${docTitle}`);
    //  console.log(response);
      if (response.ok) {
        const docInfo = await response.json();
        if (docInfo.error) return;
        console.log(docInfo);
        const targetUrl = `/${docInfo.url}`;
        const link = document.createElement('a');
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