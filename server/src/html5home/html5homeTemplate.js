import './html5home.css';
import { docReady } from '../public/scripts/modules/helpers.js';
import { addLogo } from '../public/scripts/modules/logo.js';
import { addFooterContents } from '../public/scripts/modules/footer.js';
import { setMetadata } from '../public/scripts/modules/metadata.js';
import { addVersionSelector } from '../public/scripts/modules/versionSelector.js';
import { addAvatar } from '../public/scripts/modules/avatar.js';
import { addSearchBox } from '../public/scripts/modules/searchBox.js';
import { addSkipNav } from '../public/scripts/modules/skipNav.js';
import { addInternalBadge } from '../public/scripts/modules/internal.js';
import { handleContextId } from '../public/scripts/modules/redirect.js';

docReady(async function () {
  await handleContextId();
  addSkipNav();
  await setMetadata();
  addInternalBadge();
  addLogo();
  addSearchBox();
  await addVersionSelector();
  await addAvatar();
  addFooterContents();
});
