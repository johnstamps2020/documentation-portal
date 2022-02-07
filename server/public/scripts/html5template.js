import { docReady } from './modules/helpers.js';
import { addPageNavigators } from './modules/navigators.js';
import { addLogo } from './modules/logo.js';
import { addFooterContents } from './modules/footer.js';
import { addFeedbackElements } from './modules/feedback.js';
import { setMetadata } from './modules/metadata.js';
import { addVersionSelector } from './modules/versionSelector.js';
import { addAvatar } from './modules/avatar.js';
import { addSearchBox } from './modules/searchBox.js';
import { addCopyButton, normalizeCode } from './modules/code.js';
import { setUpSidebar } from './modules/sidebar.js';
import { showTopicRecommendations } from './modules/recommendations.js';
import './prism.js';
import '../stylesheets/html5template.css';
import '../stylesheets/prism.css';

docReady(async function() {
  showTopicRecommendations();
  setUpSidebar();
  normalizeCode();
  await setMetadata();
  addLogo();
  addSearchBox();
  await addVersionSelector();
  await addAvatar();
  await addPageNavigators();
  addFooterContents();
  addFeedbackElements();
  addCopyButton();
});
