import "./html5home.css";

import { docReady } from "../modules/helpers";
import { addLogo } from "../modules/logo";
import { addFooterContents } from "../modules/footer";
import { setMetadata } from "../../../server/public/scripts/modules/metadata";
import { addVersionSelector } from "../modules/versionSelector";
import { addAvatar } from "../modules/avatar";
import { addSearchBox } from "../modules/searchBox";
import { addSkipNav } from "../modules/skipNav";
import { addInternalBadge } from "../modules/internal";
import { handleContextId } from "../modules/redirect";

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
