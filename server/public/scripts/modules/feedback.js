import '../../stylesheets/modules/feedback.css';
window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'G-QRTVTBY678');

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

  const feedbackFormTitle = document.createElement('div');
  feedbackFormTitle.setAttribute('class', 'feedbackFormTitle');
  feedbackFormTitle.innerText =
    feedbackType === 'positive'
      ? 'Thanks. We have recorded your vote. Anything more to tell us?'
      : 'Thanks. We have recorded your vote. Please let us know how we can improve this content.';

  const commentLabel = document.createElement('div');
  commentLabel.innerText = 'Your comment';

  const commentBox = document.createElement('textarea');
  commentBox.setAttribute('name', 'userComment');

  const usernameLabel = document.createElement('div');
  usernameLabel.innerText = 'Your email:';

  const usernameInput = document.createElement('input');
  usernameInput.setAttribute('name', 'user');
  usernameInput.setAttribute('type', 'text');
  usernameInput.setAttribute('value', email);

  const usernameInfo = document.createElement('div');
  usernameInfo.innerText =
    'Leave this field empty if you want to stay anonymous';

  const submitButton = document.createElement('button');
  submitButton.setAttribute('class', 'feedbackSubmitButton');
  submitButton.setAttribute('type', 'button');
  submitButton.innerText = 'Submit';
  submitButton.addEventListener('click', function() {
    sendFeedback(formWrapperId);
  });

  const closeButton = document.createElement('button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.setAttribute('class', 'feedbackFormCloseButton');
  closeButton.setAttribute('type', 'button');
  closeButton.addEventListener('click', function() {
    closeForm(formWrapperId);
  });

  const feedbackForm = document.createElement('form');
  feedbackForm.setAttribute('id', formId);

  feedbackForm.appendChild(feedbackFormTitle);
  feedbackForm.appendChild(commentLabel);
  feedbackForm.appendChild(commentBox);
  feedbackForm.appendChild(usernameLabel);
  feedbackForm.appendChild(usernameInput);
  feedbackForm.appendChild(usernameInfo);
  feedbackForm.appendChild(submitButton);
  feedbackForm.appendChild(closeButton);

  const formWrapper = document.createElement('div');
  formWrapper.setAttribute('id', formWrapperId);
  formWrapper.setAttribute('class', 'feedbackFormWrapper');
  formWrapper.appendChild(feedbackForm);

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
  gtag('event', 'user_feedback', {
    feedback_type: feedbackType,
    product_name: window.docProduct,
    doc_version: window.docVersion,
    doc_platform: window.docPlatform,
    doc_category: window.docCategory,
  });

  if (!form) {
    const body = document.querySelector('body');
    body.appendChild(
      renderForm(feedbackType, window.userInformation?.preferred_username)
    );
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

function createFeedbackButton(positive) {
  const buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('class', 'feedbackButtonContainer');

  const button = document.createElement('button');
  button.setAttribute(
    'aria-label',
    positive ? 'This topic was helpful' : 'This topic needs improvement'
  );
  button.classList.add('feedbackButton');
  button.classList.add(
    positive ? 'feedbackButtonPositive' : 'feedbackButtonNegative'
  );
  button.addEventListener('click', function() {
    toggleFeedbackForm(positive ? 'positiveFeedback' : 'negativeFeedback');
  });

  buttonContainer.appendChild(button);

  return buttonContainer;
}

export function addFeedbackElements() {
  const feedbackLabel = document.createElement('span');
  feedbackLabel.innerText = 'Was this page helpful? Send us your comments!';

  const thumbsUp = createFeedbackButton(true);
  const thumbsDown = createFeedbackButton(false);

  const thumbsWrapper = document.createElement('div');
  thumbsWrapper.setAttribute('class', 'feedbackThumbs');
  thumbsWrapper.appendChild(thumbsUp);
  thumbsWrapper.appendChild(thumbsDown);

  const feedbackButtons = document.createElement('div');
  feedbackButtons.setAttribute('class', 'feedback');
  feedbackButtons.appendChild(feedbackLabel);
  feedbackButtons.appendChild(thumbsWrapper);

  const topicBody = document.querySelector('main');
  if (topicBody) {
    topicBody.appendChild(feedbackButtons);
  } else {
    console.log('no main');
  }
  const body = document.querySelector('body');
  body.appendChild(renderThanksMessage());
}
