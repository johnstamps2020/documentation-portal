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

function wrapInQuotes(stringsToWrap) {
  function addQuotes(stringToModify) {
    return stringToModify.includes(',')
      ? '"' + stringToModify + '"'
      : stringToModify;
  }

  if (Array.isArray(stringsToWrap)) {
    return stringsToWrap.map((s) => addQuotes(s));
  } else if (typeof stringsToWrap === 'string') {
    return addQuotes(stringsToWrap);
  } else {
    return stringsToWrap;
  }
}

// Filter values are passed around as strings that use commas to separate values. To avoid issues with splitting,
// values that contain commas must be wrapped in quotes.
// Filter values are parsed by the getFiltersFromUrl function in searchController.js.
export async function setMetadata() {
  const docId = document
    .querySelector('[name="gw-doc-id"]')
    ?.getAttribute('content');

  if (!docId) {
    return;
  }

  let sessionDocId = sessionStorage.getItem('docId');

  if (docId === sessionDocId) {
    //console.log('Fetching metadata from sessionStorage');
    window.docProduct = sessionStorage.getItem('docProduct');
    window.docPlatform = sessionStorage.getItem('docPlatform');
    window.docVersion = sessionStorage.getItem('docVersion');
    window.docSubject = sessionStorage.getItem('docSubject');
    window.docLanguage = sessionStorage.getItem('docLanguage');
    window.docRelease = sessionStorage.getItem('docRelease');
    window.docTitle = sessionStorage.getItem('docTitle');
    window.docDisplayTitle = sessionStorage.getItem('docDisplayTitle');
    window.docInternal = sessionStorage.getItem('docInternal') === 'true';
    window.docEarlyAccess = sessionStorage.getItem('docEarlyAccess') === 'true';
  } else {
    //console.log('Fetching metadata from endpoint');
    const response = await fetch(`/safeConfig/docMetadata/${docId}`);
    if (response.ok) {
      try {
        const valueSeparator = ',';
        const docInfo = await response.json();
        if (!docInfo.error) {
          sessionStorage.setItem('docId', docId);

          window.docProduct = wrapInQuotes(docInfo.product)?.join(
            valueSeparator
          );
          sessionStorage.setItem('docProduct', window.docProduct);

          window.docPlatform = wrapInQuotes(docInfo.platform)?.join(
            valueSeparator
          );
          sessionStorage.setItem('docPlatform', window.docPlatform);

          window.docVersion = wrapInQuotes(docInfo.version)?.join(
            valueSeparator
          );
          sessionStorage.setItem('docVersion', window.docVersion);

          sessionStorage.removeItem('docSubject');
          window.docSubject = wrapInQuotes(docInfo.subject)?.join(
            valueSeparator
          );
          if (window.docSubject) {
            sessionStorage.setItem('docSubject', window.docSubject);
          }

          window.docLanguage = wrapInQuotes(docInfo.language);
          sessionStorage.setItem('docLanguage', window.docLanguage);

          sessionStorage.removeItem('docRelease');
          window.docRelease = wrapInQuotes(docInfo.release)?.join(
            valueSeparator
          );
          if (window.docRelease) {
            sessionStorage.setItem('docRelease', window.docRelease);
          }

          window.docTitle = wrapInQuotes(docInfo.docTitle);
          sessionStorage.setItem('docTitle', window.docTitle);

          sessionStorage.removeItem('docDisplayTitle');
          window.docDisplayTitle = wrapInQuotes(docInfo.docDisplayTitle);
          if (window.docDisplayTitle) {
            sessionStorage.setItem('docDisplayTitle', window.docDisplayTitle);
          }

          window.docInternal = docInfo.docInternal;
          sessionStorage.setItem('docInternal', window.docInternal);

          window.docEarlyAccess = docInfo.docEarlyAccess;
          sessionStorage.setItem('docEarlyAccess', window.docEarlyAccess);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  const userResponse = await fetch('/userInformation');
  if (!userResponse.ok) {
    window.userInformation = {
      isLoggedIn: false,
    };
    return;
  }

  const userInformation = await userResponse.json();
  window.userInformation = userInformation;
  sendUserId(userInformation);

  const selectorResponse = await fetch(
    `/safeConfig/versionSelectors?docId=${docId}`
  );
  const jsonResponse = await selectorResponse.json();
  window.matchingVersionSelector = jsonResponse.matchingVersionSelector;
}
