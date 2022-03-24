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

function wrapInQuotes(stringsToWrap) {
  function addQuotes(stringToModify) {
    return stringToModify.includes(',')
      ? '"' + stringToModify + '"'
      : stringToModify;
  }

  if (Array.isArray(stringsToWrap)) {
    return stringsToWrap.map(s => addQuotes(s));
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
  if (docId) {
    const response = await fetch(`/safeConfig/docMetadata/${docId}`);
    if (response.ok) {
      try {
        const valueSeparator = ',';
        const docInfo = await response.json();
        if (!docInfo.error) {
          window.docProduct = wrapInQuotes(docInfo.product)?.join(
            valueSeparator
          );
          window.docPlatform = wrapInQuotes(docInfo.platform)?.join(
            valueSeparator
          );
          window.docVersion = wrapInQuotes(docInfo.version)?.join(
            valueSeparator
          );
          window.docCategory = wrapInQuotes(docInfo.category)?.join(
            valueSeparator
          );
          window.docSubject = wrapInQuotes(docInfo.subject)?.join(
            valueSeparator
          );
          window.docRelease = wrapInQuotes(docInfo.release)?.join(
            valueSeparator
          );
          window.docTitle = wrapInQuotes(docInfo.docTitle);
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
