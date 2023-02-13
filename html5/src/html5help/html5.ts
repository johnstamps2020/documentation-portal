import { docReady } from "../modules/helpers";
import { addPageNavigators } from "../modules/navigators";
import { addLogo } from "../modules/logo";
import { addFooterContents } from "../modules/footer";
import { addFeedbackElements } from "../modules/feedback";
import { setMetadata } from "../modules/metadata";
import { addVersionSelector } from "../modules/versionSelector";
import { addAvatar } from "../modules/avatar";
import { addSearchBox } from "../modules/searchBox";
import { normalizeCode, highlightCode } from "../modules/code";
import { setUpSidebar } from "../modules/sidebar";
import { showTopicRecommendations } from "../modules/recommendations";
import { addSkipNav } from "../modules/skipNav";
import { addInternalBadge } from "../modules/internal";
import { addLightbox } from "../modules/lightbox";
import { addEarlyAccessMark } from "../modules/earlyAccess";
import "../stylesheets/html5template.css";
import { UserInformation } from "@theme/Types";

declare global {
  interface Window {
    docProduct: string;
    docPlatform: string;
    docVersion: string;
    docSubject: string;
    docTitle: string;
    userInformation: UserInformation;
  }
}

declare const BUILD_MODE: string;
const isOffline = BUILD_MODE === "offline";

docReady(async function() {
  normalizeCode();
  addSkipNav();
  addLogo();
  addLightbox();
  highlightCode();
  !isOffline && (await setMetadata());
  addSearchBox(isOffline);
  addEarlyAccessMark();
  addInternalBadge();
  !isOffline && addFeedbackElements();
  addFooterContents(isOffline);
  await setUpSidebar();
  addPageNavigators(isOffline);
  !isOffline && addVersionSelector();
  !isOffline && addAvatar();
  !isOffline && showTopicRecommendations();
});
