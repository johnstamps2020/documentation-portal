import { docReady } from '../modules/helpers';
import { addPageNavigators } from '../modules/navigators';
import { addLogo } from '../modules/logo';
import { addFooterContents } from '../modules/footer';
import { addFeedbackElements } from '../modules/feedback';
import { setMetadata } from '../modules/metadata';
import { addVersionSelector } from '../modules/versionSelector';
import { addAvatar } from '../modules/avatar';
import { addSearchBox } from '../modules/searchBox';
import { highlightCode, normalizeCode } from '../modules/code';
import { setUpSidebar } from '../modules/sidebar';
import { addSkipNav } from '../modules/skipNav';
import { addInternalBadge } from '../modules/internal';
import { addLightbox } from '../modules/lightbox';
import { addEarlyAccessMark } from '../modules/earlyAccess';
import '../stylesheets/html5template.css';
import { UserInformation } from '@doctools/components';
import { addBookLinks } from '../modules/xbook-ref';

declare global {
  interface Window {
    docProduct: string;
    docPlatform: string;
    docRelease: string;
    docVersion: string;
    docSubject: string;
    docTitle: string;
    docDisplayTitle: string;
    docLanguage: string;
    userInformation: UserInformation;
  }
}

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
  !isOffline &&
    setMetadata().then(() => {
      addVersionSelector();
      addAvatar();
      addInternalBadge();
      addEarlyAccessMark();
      addSearchBox(isOffline);
      addPageNavigators(isOffline);
      addFeedbackElements();
      addBookLinks();
    });
});
