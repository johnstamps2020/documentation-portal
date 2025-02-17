async function getHash(string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
}

async function sendUserId(userInformation) {
  if (userInformation.isLoggedIn) {
    const userId = await getHash(userInformation.preferred_username);
    const isEmployee = userInformation.hasGuidewireEmail;
    window.dataLayer = window.dataLayer || [];
    if (
      !window.dataLayer.some((d) => d.event === 'login' && d.userId === userId)
    ) {
      window.dataLayer.push({
        user_id: userId,
        is_employee: isEmployee,
      });
    }
  }
}

export async function setMetadata() {
  let docId = document
    .querySelector('[name="gw-doc-id"]')
    ?.getAttribute('content');
  if (!docId) {
    const docIdResponse = await fetch(
      `/safeConfig/entity/doc/id?url=${window.location.pathname}`
    );
    const docIdResponseJson = await docIdResponse.json();
    docId = docIdResponseJson?.docId;
  }
  if (docId) {
    const response = await fetch(`/safeConfig/entity/doc/metadata?id=${docId}`);
    if (response.status === 200) {
      try {
        const docInfo = await response.json();
        window.docId = docId;
        window.docTitle = docInfo.docTitle;
        window.docInternal = docInfo.docInternal;
        window.docEarlyAccess = docInfo.docEarlyAccess;
        window.docUpdatePreview = docInfo.docUpdatePreview;
        window.docProduct = docInfo.docProducts;
        window.docVersion = docInfo.docVersions;
        window.docPlatform = docInfo.docPlatforms;
        window.docRelease = docInfo.docReleases;
        window.docCategory = docInfo.docCategories;
        window.docSubject = docInfo.docSubjects;
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
  if (selectorResponse.ok) {
    const jsonResponse = await selectorResponse.json();
    window.matchingVersionSelector = jsonResponse.matchingVersionSelector;
  } else {
    window.matchingVersionSelector = {};
  }
}
