import "./html5home.css";

import { docReady } from "../modules/helpers.js";
import { addLogo } from "../modules/logo.js";
import { addFooterContents } from "../modules/footer.js";
import { setMetadata } from "../../../server/public/scripts/modules/metadata.js";
import { addVersionSelector } from "../modules/versionSelector.js";
import { addAvatar } from "../modules/avatar.js";
import { addSearchBox } from "../modules/searchBox.js";
import { addSkipNav } from "../modules/skipNav.js";
import { addInternalBadge } from "../modules/internal.js";
import { handleContextId } from "../modules/redirect.js";

declare const BUILD_MODE: string;
const isOffline = BUILD_MODE === "offline";

docReady(async function () {
  await handleContextId();
  addSkipNav();
  !isOffline && (await setMetadata());
  addInternalBadge();
  addLogo();
  !isOffline && addSearchBox();
  !isOffline && (await addVersionSelector());
  !isOffline && (await addAvatar());
  addFooterContents(isOffline);
});
