async function getHash(string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(bytes => bytes.toString(16).padStart(2, '0')).join('');
}

async function sendUserId(userInformation) {
  if (userInformation.isLoggedIn) {
    const userId = await getHash(userInformation.preferred_username);
    const isEmployee = userInformation.hasGuidewireEmail;
    window.dataLayer = window.dataLayer || [];
    if (
      !window.dataLayer.some(d => d.event === 'login' && d.userId === userId)
    ) {
      window.dataLayer.push({
        user_id: userId,
        is_employee: isEmployee,
      });
    }
  }
}

export async function setMetadata() {
  const docId = document
    .querySelector('[name="gw-doc-id"]')
    ?.getAttribute('content');
  if (docId) {
    const response = await fetch(`/safeConfig/docMetadata/${docId}`);
    if (response.ok) {
      try {
        const docInfo = await response.json();
        if (!docInfo.error) {
          window.docProduct = docInfo.product?.join(',');
          window.docPlatform = docInfo.platform?.join(',');
          window.docVersion = docInfo.version?.join(',');
          window.docCategory = docInfo.category?.join(',');
          window.docSubject = docInfo.subject?.join(',');
          window.docRelease = docInfo.release?.join(',');
          window.docTitle = docInfo.docTitle;
          window.docInternal = docInfo.docInternal;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  const userResponse = await fetch('/userInformation');
  const userInformation = await userResponse.json();
  window.userInformation = userInformation;
  sendUserId(userInformation);

  const selectorResponse = await fetch(
    `/safeConfig/versionSelectors?docId=${docId}`
  );
  const jsonResponse = await selectorResponse.json();
  window.matchingVersionSelector = jsonResponse.matchingVersionSelector;
}
