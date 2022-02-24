window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'G-QRTVTBY678');

const docProductElement = document.querySelector("meta[name = 'gw-product']");
let docProduct = docProductElement
  ? docProductElement.content.replace(/ for Guidewire Cloud/g, '')
  : docProductElement;
let docPlatform = document.querySelector("meta[name = 'gw-platform']")?.content;
let docVersion = document.querySelector("meta[name = 'gw-version']")?.content;
let docCategory = document.querySelector("meta[name = 'DC.coverage']")?.content;
let docTitle = undefined;
const topicId = window.location.pathname;

async function showTopicRecommendations() {
  const response = await fetch(`/recommendations?topicId=${topicId}`);
  if (response.ok) {
    const json = await response.json();
    const recommendedTopics = json.recommendations;
    const recommendationsContainer = document.createElement('div');
    recommendationsContainer.setAttribute('class', 'recommendations');
    recommendationsContainer.innerHTML = `
    <span>Recommended topics</span>
    <ul id="recommendedTopics"></ul>
    `;

    const topicBody = document.getElementById('wh_topic_body');
    if (topicBody) {
      topicBody.appendChild(recommendationsContainer);
    }
    const recommendedTopicsList = document.getElementById('recommendedTopics');
    for (const topic of recommendedTopics) {
      const recommendedTopicListItem = document.createElement('li');
      const recommendedTopicLink = document.createElement('a');
      recommendedTopicLink.setAttribute('href', topic.id);
      recommendedTopicLink.innerText = topic.title;
      recommendedTopicListItem.appendChild(recommendedTopicLink);
      recommendedTopicsList.appendChild(recommendedTopicListItem);
    }
  }
}

async function fetchMetadata() {
  const docId = document
    .querySelector('[name="gw-doc-id"]')
    ?.getAttribute('content');
  if (docId) {
    const response = await fetch(`/safeConfig/docMetadata/${docId}`);
    if (response.ok) {
      try {
        const docInfo = await response.json();
        if (!docInfo.error) {
          docProduct = docInfo.product?.join(',') || docProduct;
          docPlatform = docInfo.platform?.join(',') || docPlatform;
          docVersion = docInfo.version?.join(',') || docVersion;
          docCategory = docInfo.category?.join(',') || docCategory;
          docTitle = docInfo.docTitle;
          return docInfo;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
}

let metadata = undefined;

async function findBestMatchingTopic(searchQuery, targetDocVersion) {
  try {
    const baseUrl = window.location.protocol + '//' + window.location.host;
    const searchUrl = new URL('/search', baseUrl);
    searchUrl.searchParams.append('rawJSON', 'true');
    searchUrl.searchParams.append('q', `${searchQuery}`);
    searchUrl.searchParams.append('product', `${docProduct}`);
    searchUrl.searchParams.append('version', `${targetDocVersion}`);
    if (docTitle) {
      searchUrl.searchParams.append('title', `${docTitle}`);
    }
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
    if (!docProduct) {
      return null;
    }
    let docId = document
      .querySelector('[name="gw-doc-id"]')
      ?.getAttribute('content');
    if (docId == null) {
      const docIdResponse = await fetch(
        `/safeConfig/docId?platforms=${docPlatform}&products=${docProduct}&versions=${docVersion}&url=${topicId}${
          docTitle ? `&title=${docTitle}` : ''
        }`
      );
      const docIdResponseJson = await docIdResponse.json();
      docId = docIdResponseJson.docId;
    }
    const response = await fetch(`/safeConfig/versionSelectors?docId=${docId}`);
    const jsonResponse = await response.json();
    const matchingVersionSelector = jsonResponse.matchingVersionSelector;
    if (Object.keys(matchingVersionSelector).length > 0) {
      const allVersions = matchingVersionSelector.allVersions;
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

      for (const val of allVersions) {
        const option = document.createElement('option');
        option.text = val.versions[0];
        option.label = val.label;
        option.value = `/${val.url}`;
        if (val.currentlySelected) {
          option.setAttribute('selected', 'selected');
        }

        select.appendChild(option);
      }

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

function showAvatarMenu(event) {
  if (event.target.id === 'avatarButton') {
    const avatarMenu = document.getElementById('avatarMenu');
    avatarMenu.classList.toggle('show');
  }
}

function closeAvatarMenu(event) {
  if (!event.target.closest('#avatarButton')) {
    const avatarMenu = document.getElementById('avatarMenu');
    if (avatarMenu.classList.contains('show')) {
      avatarMenu.classList.remove('show');
    }
  }
}

function createAvatarButton(fullName, username) {
  const button = document.createElement('button');
  button.setAttribute('id', 'avatarButton');
  button.setAttribute('class', 'headerButtonsButton');
  button.setAttribute('aria-label', 'user information');
  button.setAttribute('type', 'button');
  button.addEventListener('click', showAvatarMenu);
  window.addEventListener('click', closeAvatarMenu);
  button.innerHTML = `
    <div id="avatarMenu" class="headerButtonsMenu">
        <div class="headerButtonsMenuHeader">
            <div class="avatarMenuName">${fullName}</div>
            <div class="avatarMenuEmail">${username}</div>
        </div>
        <hr class="headerButtonsMenuDivider"/>
        <div class="headerButtonsMenuActions">
            <a class="avatarMenuLogout" href="/gw-logout">Log out</a>
        </div>
    </div>`;

  return button;
}

async function getLoginButtonOrAvatar() {
  let userButton;
  const response = await fetch('/userInformation');
  const { isLoggedIn, name, preferred_username } = await response.json();

  if (isLoggedIn) {
    userButton = createAvatarButton(name, preferred_username);
  } else {
    userButton = document.createElement('a');
    userButton.setAttribute('id', 'loginButton');
    userButton.setAttribute('href', '/gw-login');
    userButton.innerText = 'Log in';
  }
  return userButton;
}

async function addAvatar() {
  try {
    const userButton = await getLoginButtonOrAvatar();
    document.getElementById('customHeaderElements').appendChild(userButton);
  } catch (error) {
    console.log(error);
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
    await addAvatar();
    customHeaderElements.classList.remove('invisible');
  }
}

function hideElement(elementId) {
  const element = document.getElementById(elementId);
  if (!element.classList.contains('hidden')) {
    element.classList.add('hidden');
  }
}

function closeForm(formId) {
  hideElement(formId);
  showThanksMessage();
}

async function sendFeedback(formId) {
  const form = document.getElementById(formId);
  const submitButton = form.querySelector('.feedbackSubmitButton');
  const body = document.body;

  const feedbackType = formId.includes('negative') ? 'negative' : 'positive';

  function getPossibleContacts() {
    const creatorInfos = document.querySelectorAll("meta[name = 'DC.creator']");
    if (creatorInfos.length === 0) {
      return undefined;
    }
    const emails = [];
    const pattern = /[A-z]*@guidewire.com/g;
    for (const creatorInfo of creatorInfos) {
      const matches = creatorInfo.content.matchAll(pattern);
      for (const match of matches) {
        emails.push(match[0]);
      }
    }
    return emails;
  }

  let userCommentText = form.querySelector('textarea[name="userComment"]')
    ?.value;
  if (userCommentText.length > 0) {
    // remove duplicate \n and then replace with 0x0A, which we undo in jiraController.js.
    // this gets the comment through since we tokenize on \n.
    userCommentText = userCommentText.replace(/(\n)\1{1,}/g, '$1');
    userCommentText = userCommentText.replace(/\n/g, '0x0A');
  }

  if (userCommentText) {
    submitButton.classList.add('disabled');
    submitButton.removeAttribute('onclick');
    body.classList.add('wait');
    const feedbackRequest = {
      summaryText:
        'User feedback: ' + document.querySelector('title').innerHTML,
      descriptionText: {
        //The key is also the label
        Product: docProduct,
        Version: docVersion,
        Platform: docPlatform,
        Category: docCategory,
        URL: window.location.href,
        'Source file (parent if chunked or nested)': document.querySelector(
          "meta[name = 'wh-source-relpath']"
        )?.content,
        'Topic ID': document.querySelector('body').id?.content,
        'Feedback type': feedbackType === 'negative' ? 'Critique' : 'Kudos',
        Comment: userCommentText,
        'Reported by': form.querySelector('input[name="user"]')?.value,
        'Possible contacts': getPossibleContacts(),
      },
      feedbackType: feedbackType,
    };

    const descriptionText = feedbackRequest.descriptionText;
    let cleanDescriptionText = {};
    Object.keys(descriptionText).forEach(prop => {
      if (descriptionText[prop] && descriptionText[prop] !== 'undefined') {
        cleanDescriptionText[prop] = descriptionText[prop];
      }
    });

    feedbackRequest.descriptionText = cleanDescriptionText;

    const result = await fetch('/jira', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackRequest),
    });

    body.classList.remove('wait');
    submitButton.classList.remove('disabled');
    submitButton.setAttribute(
      'onclick',
      "sendFeedback('" + formId + "', '" + feedbackType + "')"
    );
    closeForm(formId);

    return result;
  } else {
    closeForm(formId);
  }
}

function renderForm(feedbackType, email) {
  const formWrapperId = `${feedbackType.toLowerCase()}Feedback`;
  const formId = `${feedbackType.toLowerCase()}FeedbackForm`;
  const commentBox = `<div>Your comment:</div>
  <textarea name="userComment"></textarea>`;
  const username = `<div>Your email:</div>
  <input name="user" type="text" value="${email}"/>
  <div>Leave this field empty if you want to stay anonymous</div>`;
  const submitButton = `<div role="button" onClick="sendFeedback('${formWrapperId}')"
                       class="feedbackSubmitButton">Submit</div>`;
  const closeButton = `<div role="button" aria-label="Close" onClick="closeForm('${formWrapperId}')" class="feedbackFormCloseButton"></div>`;

  const formWrapper = document.createElement('div');
  formWrapper.setAttribute('id', formWrapperId);
  formWrapper.setAttribute('class', 'feedbackFormWrapper');
  const feedbackForm = document.createElement('form');
  feedbackForm.setAttribute('id', formId);
  formWrapper.append(feedbackForm);

  if (feedbackType === 'positive') {
    feedbackForm.innerHTML =
      `<div class="feedbackFormTitle">Thanks. We have recorded your vote. Anything more to tell us?</div>` +
      commentBox +
      username +
      submitButton +
      closeButton;
  } else if (feedbackType === 'negative') {
    feedbackForm.innerHTML =
      `<div class="feedbackFormTitle">Thanks. We have recorded your vote. Please let us know how we can improve this content.</div>` +
      commentBox +
      username +
      submitButton +
      closeButton;
  }

  return formWrapper;
}

function renderThanksMessage() {
  const thanksMessageWrapper = document.createElement('div');
  thanksMessageWrapper.setAttribute('id', 'thanksMessage');
  thanksMessageWrapper.innerHTML = `
        <div>Thank you for your feedback!</div>
    `;
  return thanksMessageWrapper;
}

function showThanksMessage() {
  const thanksMessage = document.getElementById('thanksMessage');
  thanksMessage.className = 'show';
  setTimeout(function() {
    thanksMessage.classList.remove('show');
  }, 3000);
}

async function toggleFeedbackForm(formId) {
  const form = document.getElementById(formId);
  const feedbackType = formId.includes('negative') ? 'negative' : 'positive';
  const response = await fetch('/userInformation');
  const { preferred_username } = await response.json();
  gtag('event', 'user_feedback', {
    feedback_type: feedbackType,
    product_name: docProduct,
    doc_version: docVersion,
    doc_platform: docPlatform,
    doc_category: docCategory,
  });

  if (!form) {
    const body = document.querySelector('body');
    body.appendChild(renderForm(feedbackType, preferred_username));
  } else {
    form.classList.remove('hidden');
  }

  const thumbs = document.querySelectorAll('.feedbackButton');

  for (const thumb of thumbs) {
    thumb.classList.remove('selected');
    if (
      thumb.classList.contains(
        'feedbackButton' +
          feedbackType.charAt(0).toUpperCase() +
          feedbackType.slice(1)
      )
    ) {
      thumb.classList.add('selected');
    }
  }
}

async function addFeedbackElements() {
  const { hostname } = window.location;
  // if (!['docs.int.ccs.guidewire.net', 'localhost'].includes(hostname)) {
  //   return;
  // }
  const feedbackButtons = document.createElement('div');
  feedbackButtons.setAttribute('class', 'feedback');
  feedbackButtons.innerHTML = `
    <span>Was
    this
    page
    helpful? Send us your comments!
</span>
<div class="feedbackThumbs">
<div role="button" aria-label="This topic was helpful" title="This topic was helpful" class="feedbackButtonContainer" onclick="toggleFeedbackForm('positiveFeedback')">
<div class="feedbackButton feedbackButtonPositive"></div>
</div>
<div role="button" aria-label="This topic needs improvement" title="This topic needs improvement" class="feedbackButtonContainer" onclick="toggleFeedbackForm('negativeFeedback')">
<div class="feedbackButton feedbackButtonNegative"></div>
</div>
</div>
`;

  const topicBody = document.getElementById('wh_topic_body');
  if (topicBody) {
    topicBody.appendChild(feedbackButtons);
  }
  const body = document.querySelector('body');
  body.appendChild(renderThanksMessage());
}

async function configureSearch() {
  if (metadata) {
    const searchForms = document.querySelectorAll(
      '#searchForm, #searchFormNav'
    );
    if (searchForms.length > 0) {
      for (const searchForm of searchForms) {
        let hiddenInputsToAdd = [];
        for (const metadataKey of Object.keys(metadata)) {
          const input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', metadataKey);
          if (typeof metadata[metadataKey] === 'string') {
            input.setAttribute('value', metadata[metadataKey]);
          } else {
            input.setAttribute('value', metadata[metadataKey].join(','));
          }
          hiddenInputsToAdd.push(input);
        }
        const existingHiddenInputs = searchForm.querySelectorAll(
          'div > [type="hidden"]'
        );
        if (existingHiddenInputs.length > 0) {
          for (const existing of existingHiddenInputs) {
            searchForm.firstChild.removeChild(existing);
          }
        }

        for (const newInput of hiddenInputsToAdd) {
          searchForm.firstChild.appendChild(newInput);
        }
      }
    }
  } else {
    const productField = document.querySelector('[name="product"]');
    if (productField) {
      productField.setAttribute('value', docProduct);
    }
  }
}

function setFooter() {
  const whTopicBody = document.getElementById('wh_topic_body');
  const footer = document.querySelector('.wh_footer');
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;
      const rect = entry.target.getBoundingClientRect();
      const whTopicBodyLeft = rect.left + scrollLeft;
      const whTopicBodyPaddingLeft = window
        .getComputedStyle(wh_topic_body)
        .getPropertyValue('padding-left');
      const whTopicBodyPaddingRight = window
        .getComputedStyle(wh_topic_body)
        .getPropertyValue('padding-right');

      if (entry.contentBoxSize) {
        footer.style.width =
          'calc(' +
          entry.contentBoxSize[0].inlineSize +
          'px + ' +
          whTopicBodyPaddingRight +
          ')';
      } else {
        footer.style.width =
          'calc(' +
          entry.contentRect.width +
          'px + ' +
          whTopicBodyPaddingRight +
          ')';
      }
      footer.style.left =
        'calc(' + whTopicBodyPaddingLeft + ' + ' + whTopicBodyLeft + 'px)';
    }
  });
  resizeObserver.observe(whTopicBody);
}

async function installAndInitializePendo() {
  (function(apiKey) {
    (function(p, e, n, d, o) {
      var v, w, x, y, z;
      o = p[d] = p[d] || {};
      o._q = o._q || [];
      v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
      for (w = 0, x = v.length; w < x; ++w)
        (function(m) {
          o[m] =
            o[m] ||
            function() {
              o._q[m === v[0] ? 'unshift' : 'push'](
                [m].concat([].slice.call(arguments, 0))
              );
            };
        })(v[w]);
      y = e.createElement(n);
      y.async = !0;
      y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js';
      z = e.getElementsByTagName(n)[0];
      z.parentNode.insertBefore(y, z);
    })(window, document, 'script', 'pendo');
  })('f254cb71-32f1-4247-546f-fe9159040603');

  const response = await fetch('/userInformation');
  if (response.ok) {
    const userInformation = await response.json();
    const email = userInformation.preferred_username;
    const domain = email.split('@')[1] || 'unknown';
    const name = userInformation.name;

    pendo.initialize({
      visitor: {
        id: email,
        email: email,
        full_name: name,
        role: userInformation.hasGuidewireEmail
          ? 'employee'
          : 'customer/partner',
      },

      account: {
        id: domain, // Required if using Pendo Feedback
        // name:         // Optional
        // is_paying:    // Recommended if using Pendo Feedback
        // monthly_value:// Recommended if using Pendo Feedback
        // planLevel:    // Optional
        // planPrice:    // Optional
        // creationDate: // Optional

        // You can add any additional account level key-values here,
        // as long as it's not one of the above reserved names.
      },
    });
  }
}

docReady(async function() {
  metadata = await fetchMetadata();
  await createContainerForCustomHeaderElements();
  addCustomElements();
  addTopLinkToBreadcrumbs();
  addPublicationDate();
  if (isInIframe()) {
    hideByCssClass('wh_header');
    hideByCssClass('wh_footer');
  }
  configureSearch();
  addFeedbackElements();
  setFooter();
  showTopicRecommendations();
  installAndInitializePendo();
});
