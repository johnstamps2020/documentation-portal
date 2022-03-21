import Home from './modules/Home.js';
import ReactDOM from 'react-dom';
import { createElement } from 'react';
import './html5home.css';

import { docReady } from '../../public/scripts/modules/helpers.js';
import { addLogo } from '../../public/scripts/modules/logo.js';
import { addFooterContents } from '../../public/scripts/modules/footer.js';
import { addFeedbackElements } from '../../public/scripts/modules/feedback.js';
import { setMetadata } from '../../public/scripts/modules/metadata.js';
import { addVersionSelector } from '../../public/scripts/modules/versionSelector.js';
import { addAvatar } from '../../public/scripts/modules/avatar.js';
import { addSearchBox } from '../../public/scripts/modules/searchBox.js';
import { addSkipNav } from '../../public/scripts/modules/skipNav.js';
import { installAndInitializePendo } from '../../public/scripts/modules/pendo.js';
import { addInternalBadge } from '../../public/scripts/modules/internal.js';
import { addLightbox } from '../../public/scripts/modules/lightbox.js';

const domContainer = document.querySelector('#home_page_container');
ReactDOM.render(createElement(Home), domContainer);

docReady(async function() {
  addSkipNav();
  await setMetadata();
  addInternalBadge();
  addLogo();
  addSearchBox();
  await addVersionSelector();
  await addAvatar();
  addFooterContents();
  addFeedbackElements();
  addLightbox();
  installAndInitializePendo();
});
