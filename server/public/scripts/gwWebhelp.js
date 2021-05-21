async function findBestMatchingTopic(searchQuery, docProduct, docVersion) {
  try {
    const baseUrl = window.location.protocol + '//' + window.location.host;
    const searchUrl = new URL('/search', baseUrl);
    searchUrl.searchParams.append('rawJSON', 'true');
    searchUrl.searchParams.append('q', `${searchQuery}`);
    searchUrl.searchParams.append('product', `${docProduct}`);
    searchUrl.searchParams.append('version', `${docVersion}`);
    const response = await fetch(searchUrl.href);
    const responseBody = await response.json();
    return responseBody[0]?.href;
  } catch (err) {
    console.log(err);
    return null;
  }
}

function createContainerForCustomHeaderElements() {
  const container = document.createElement('div');
  container.setAttribute('id', 'customHeaderElements');
  container.setAttribute('class', 'invisible');
  document
    .getElementById('wh_top_menu_and_indexterms_link')
    .appendChild(container);
}

async function createVersionSelector() {
  try {
    const docProduct = document.querySelector("meta[name = 'gw-product']")
      ?.content;
    if (!docProduct) {
      return null;
    }
    const docPlatform = document.querySelector("meta[name = 'gw-platform']")[
      'content'
    ];
    const docVersion = document.querySelector("meta[name = 'gw-version']")[
      'content'
    ];

    const response = await fetch(
      `/safeConfig/versionSelectors?platform=${docPlatform}&product=${docProduct}&version=${docVersion}`
    );
    const jsonResponse = await response.json();
    const matchingVersionSelector = jsonResponse.matchingVersionSelector;
    if (matchingVersionSelector?.otherVersions.length > 0) {
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
            docProduct,
            targetDocVersion
          );
          if (bestMatchingTopic) {
            linkToOpen = bestMatchingTopic;
          }
        }
        window.location.assign(linkToOpen);
      };

      for (const val of matchingVersionSelector.otherVersions) {
        const option = document.createElement('option');
        option.text = val.label;
        let value = val.path;
        if (val.fallbackPaths) {
          value = val.fallbackPaths[0];
        }
        option.value = value;

        select.appendChild(option);
      }

      const currentlySelectedOption = document.createElement('option');
      currentlySelectedOption.text = matchingVersionSelector.version;
      currentlySelectedOption.setAttribute('selected', 'selected');
      select.appendChild(currentlySelectedOption);

      const label = document.createElement('label');
      label.innerHTML = 'Select version:';
      label.htmlFor = 'versionSelector';

      document
        .getElementById('customHeaderElements')
        .appendChild(label)
        .appendChild(select);
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function addTopLinkToBreadcrumbs() {
  try {
    const currentPagePathname = window.location.pathname;
    const response = await fetch(
      `/safeConfig/breadcrumbs?pagePathname=${currentPagePathname}`
    );
    const jsonResponse = await response.json();
    const rootPageObject = jsonResponse.rootPage;
    if (Object.keys(rootPageObject).length !== 0) {
      const listItem = document.createElement('li');
      const topicrefSpan = document.createElement('span');
      topicrefSpan.setAttribute('class', 'topicref');
      const titleSpan = document.createElement('span');
      titleSpan.setAttribute('class', 'title');
      const listItemLink = document.createElement('a');
      listItemLink.setAttribute('href', rootPageObject.path);
      listItemLink.innerText = rootPageObject.label;

      titleSpan.appendChild(listItemLink);
      topicrefSpan.appendChild(titleSpan);
      listItem.appendChild(topicrefSpan);

      function getBreadcrumbs() {
        try {
          let breadcrumbs = document.querySelector(
            '.wh_breadcrumb > .d-print-inline-block'
          );
          if (!breadcrumbs) {
            window.requestAnimationFrame(getBreadcrumbs);
          } else {
            breadcrumbs.prepend(listItem);
          }
        } catch (err) {
          console.log(err);
          return null;
        }
      }

      getBreadcrumbs();
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function addPublicationDate() {
  const pathToRoot = document.querySelector("meta[name = 'wh-path2root']")[
    'content'
  ];
  if (pathToRoot) {
    const rootUrl = pathToRoot + 'index.html';
    const result = await fetch(rootUrl);
    const parser = new DOMParser();
    const rootDoc = parser.parseFromString(await result.text(), 'text/html');
    const footerDate = rootDoc.querySelector("span[class = 'footerDate']");
    const footerLink = document.querySelector("span[class = 'footerLink']");
    footerLink.parentNode.insertBefore(footerDate, footerLink);
  }
}

function createAvatarButton(fullName, username) {
  const avatar = document.createElement('div');
  avatar.setAttribute('id', 'avatar');
  avatar.innerHTML = `
        <button 
          id="avatarButton" 
          aria-label="user information"
        >
          <div class="avatarMenu">
            <div class="avatarMenuHeader">
              <div class="avatarMenuIcon">&nbsp;</div>
              <div class="avatarMenuInfo">
                <div class="avatarMenuName">${fullName}</div>
                <div class="avatarMenuEmail">${username}</div>
              </div>
            </div>
            <div class="avatarMenuDivider"></div>
            <div class="avatarMenuActions">
              <a class="avatarMenuLogout" href="/gw-logout">Log out</a>
            </div>
          </div>
        </button>
      `;
  return avatar;
}

async function createUserButton(attemptNumber = 1, retryTimeout = 10) {
  const retryAttempts = 5;

  if (window.location.pathname.endsWith('gw-login')) {
    return;
  }
  // /userInformation is not available for a few milliseconds
  // after login, so if fetching the response fails, try again
  // in 10ms.
  try {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.setAttribute('class', 'loginLogoutButtonWrapper');
    let userButton;
    const response = await fetch('/userInformation');
    const { isLoggedIn, name, preferred_username } = await response.json();

    if (isLoggedIn) {
      userButton = createAvatarButton(name, preferred_username);
    } else {
      userButton = document.createElement('a');
    }
    buttonWrapper.appendChild(userButton);
    document.getElementById('customHeaderElements').appendChild(buttonWrapper);
  } catch (error) {
    if (attemptNumber >= retryAttempts) {
      console.log('Could not access user information endpoint. ' + error);
      return;
    }
    attemptNumber++;
    retryTimeout += 100;
    setTimeout(
      async () => createUserButton(attemptNumber, retryTimeout),
      retryTimeout
    );
  }
}

function docReady(fn) {
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function hideByCssClass(cssClass) {
  const el = document.getElementsByClassName(cssClass)[0];
  if (el) {
    el.style.display = 'none';
  }
}

async function addCustomElements() {
  const customHeaderElements = document.getElementById('customHeaderElements');
  if (customHeaderElements != null) {
    await createVersionSelector();
    await createUserButton();
    customHeaderElements.classList.remove('invisible');
  }
}

function hideFeedbackForm() {
  const forms = document.querySelectorAll('.feedbackFormWrapper');
  for (const form of forms) {
    if (!form.classList.contains('hidden')) {
      form.classList.add('hidden');
    }
  }
}

async function sendFeedback(formId, feedbackType) {
  const form = document.getElementById(formId);
  const submitButton = form.querySelector('.feedbackSubmitButton');
  const body = document.body;
  submitButton.classList.add('disabled');
  submitButton.removeAttribute('onclick');
  body.classList.add('wait');

  let selectedCheckboxes = [];
  if (feedbackType === 'negative') {
    const checkboxes = document
      .getElementById('negativeFeedbackForm')
      .querySelector('div[class="feedbackFormCheckBoxes"]')
      .querySelectorAll('label');

    for (const checkbox of checkboxes) {
      if (checkbox.querySelector('input:checked')) {
        selectedCheckboxes.push(checkbox.querySelector('span').innerHTML);
      }
    }
  }

  let reportedIssues = '';
  if (selectedCheckboxes.length > 0) {
    reportedIssues += '\n----------\n';
    for (const box of selectedCheckboxes) {
      reportedIssues += `[X] ${box}\n`;
    }
    reportedIssues += '----------\n';
  }

  const feedbackRequest = {
    summaryText: 'User feedback: ' + document.querySelector('title').innerHTML,
    descriptionText: {
      //The key is also the label
      'Feedback type': feedbackType,
      'Reported by': form.querySelector('input[name="user"]')?.value,
      'Originating URL': window.location.href,
      'Source path': document.querySelector("meta[name = 'wh-source-relpath']")
        ?.content,
      'Topic ID': document.querySelector('body').id?.content,
      Version: document.querySelector("meta[name = 'gw-version']")?.content,
      Product: document.querySelector("meta[name = 'gw-product']")?.content,
      Platform: document.querySelector("meta[name = 'gw-platform']")?.content,
      Category: document.querySelector("meta[name = 'DC.coverage']")?.content,
      'User comment':
        reportedIssues +
        form.querySelector('textarea[name="userComment"]')?.value,
    },
    feedbackType: feedbackType,
  };

  const result = await fetch('/jira', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackRequest),
  });

  const thanks = `
    <div class="thanks">
        <div>Thank you for your feedback!</div>
        <div role="button" aria-label="Close" onclick="hideFeedbackForm()" class="feedbackFormCloseButton"/>
    </div>
  `;

  form.innerHTML = thanks;

  body.classList.remove('wait');

  return result;
}

function renderForm(feedbackType, email) {
  const formId = `${feedbackType}FeedbackForm`;
  return `
<form id="${formId}">
    ${
      feedbackType === 'negative'
        ? `<div class="feedbackFormTitle">Please let us know how we can improve this content.</div>
          <div class="feedbackFormCheckBoxes">
          <label>
            <input type="checkbox" name="missing" />
            <span>Some information is incorrect or missing</span>
          </label>
          <label>
            <input type="checkbox" name="graphics" />
            <span>More graphics or examples would be helpful</span>
          </label>
          <label>
            <input type="checkbox" name="typos" />
            <span>There are typos</span>
          </label>
          <label>
            <input type="checkbox" name="broken" />
            <span>Some links are broken</span>
          </label>
          <label>
            <input type="checkbox" name="other" />
            <span>Other</span>
          </label>
        </div>`
        : '<div class="feedbackFormTitle">Good to know! Anything more to tell us?</div>'
    }
    <div>Your comment:</div>
    <textarea name="userComment"></textarea>
    <div>Your email:</div> 
    <input name="user" type="text" value="${email}" />
    <div>Leave this field empty if you want to stay anonymous</div>
    <div role="button" onclick="sendFeedback('${formId}', '${feedbackType}')" class="feedbackSubmitButton">Submit</div>
    <div role="button" aria-label="Close" onclick="hideFeedbackForm()" class="feedbackFormCloseButton"/>
</form>
  `;
}

function toggleFeedbackForm(id) {
  const form = document.querySelector(`#${id}`);
  form.classList.toggle('hidden');
}

async function addFeedbackButtons() {
  const response = await fetch('/userInformation');
  const { preferred_username } = await response.json();

  const feedbackButtons = document.createElement('div');
  feedbackButtons.setAttribute('class', 'feedback');
  feedbackButtons.innerHTML = `
    <span>Was this page helpful?</span>
    <div class="feedbackThumbs">
    <div role="button" class="feedbackButtonPositive" onclick="toggleFeedbackForm('positiveFeedback')"></div>
    <div role="button" class="feedbackButtonNegative" onclick="toggleFeedbackForm('negativeFeedback')"></div>
    </div>
  `;

  const positiveFormWrapper = document.createElement('div');
  positiveFormWrapper.setAttribute('class', 'feedbackFormWrapper hidden');
  positiveFormWrapper.setAttribute('id', 'positiveFeedback');
  positiveFormWrapper.innerHTML = renderForm('positive', preferred_username);

  const negativeFormWrapper = document.createElement('div');
  negativeFormWrapper.setAttribute('class', 'feedbackFormWrapper hidden');
  negativeFormWrapper.setAttribute('id', 'negativeFeedback');
  negativeFormWrapper.innerHTML = renderForm('negative', preferred_username);

  const body = document.querySelector('body');
  body.appendChild(positiveFormWrapper);
  body.appendChild(negativeFormWrapper);

  const topicBody = document.getElementById('wh_topic_body');
  if (topicBody) {
    topicBody.appendChild(feedbackButtons);
  }
}

docReady(async function() {
  await createContainerForCustomHeaderElements();
  addCustomElements();
  addTopLinkToBreadcrumbs();
  addPublicationDate();
  if (isInIframe()) {
    hideByCssClass('wh_header');
    hideByCssClass('wh_footer');
  }
  addFeedbackButtons();
});
