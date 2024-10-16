import { addAvatar } from '../modules/avatar';
import { highlightCode, normalizeCode } from '../modules/code';
import { addEarlyAccessMark } from '../modules/earlyAccess';
import { addFeedbackElements } from '../modules/feedback';
import { addFooterContents } from '../modules/footer';
import { docReady } from '../modules/helpers';
import { addInternalBadge } from '../modules/internal';
import { addLightbox } from '../modules/lightbox';
import { addLogo } from '../modules/logo';
import { setMetadata } from '../modules/metadata';
import { addPageNavigators } from '../modules/navigators';
import { addSearchBox } from '../modules/searchBox';
import { setUpSidebar } from '../modules/sidebar';
import { addSkipNav } from '../modules/skipNav';
import { addVersionSelector } from '../modules/versionSelector';
import { addBookLinks } from '../modules/xbook-ref';
import '../stylesheets/html5template.css';

declare const BUILD_MODE: string;
const isOffline = BUILD_MODE === 'offline';

docReady(async function () {
  normalizeCode();
  addSkipNav();
  setUpSidebar();
  addLightbox();
  addLogo();
  addFooterContents(isOffline);
  highlightCode();
  !isOffline
    ? setMetadata().then(() => {
        addVersionSelector();
        addAvatar();
        addInternalBadge();
        addEarlyAccessMark();
        addSearchBox(isOffline);
        addPageNavigators(isOffline);
        addFeedbackElements();
        addBookLinks();
      })
    : (() => {
        addSearchBox(isOffline);
        addPageNavigators(isOffline);
      })();
});
