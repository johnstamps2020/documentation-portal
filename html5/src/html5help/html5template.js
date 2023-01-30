import { docReady } from "../modules/helpers.js";
import { addPageNavigators } from "../modules/navigators.js";
import { addLogo } from "../modules/logo.js";
import { addFooterContents } from "../modules/footer.js";
import { addFeedbackElements } from "../modules/feedback.js";
import { setMetadata } from "../modules/metadata.js";
import { addVersionSelector } from "../modules/versionSelector.js";
import { addAvatar } from "../modules/avatar.js";
import { addSearchBox } from "../modules/searchBox.js";
import { normalizeCode, highlightCode } from "../modules/code.js";
import { setUpSidebar } from "../modules/sidebar.js";
import { showTopicRecommendations } from "../modules/recommendations.js";
import { addSkipNav } from "../modules/skipNav.js";
import { addInternalBadge } from "../modules/internal.js";
import { addLightbox } from "../modules/lightbox.js";
import { addEarlyAccessMark } from "../modules/earlyAccess.js";
import "../stylesheets/html5template.css";

const isOffline = BUILD_MODE === "offline";

docReady(async function () {
  normalizeCode();
  addSkipNav();
  !isOffline && showTopicRecommendations();
  await setUpSidebar();
  !isOffline && (await setMetadata());
  addInternalBadge();
  addEarlyAccessMark();
  addLogo();
  !isOffline && addSearchBox();
  !isOffline && (await addVersionSelector());
  !isOffline && (await addAvatar());
  await addPageNavigators(isOffline);
  addFooterContents(isOffline);
  !isOffline && addFeedbackElements();
  addLightbox();
  highlightCode();
});
