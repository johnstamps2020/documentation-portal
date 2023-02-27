import './html5skip.css';

import {
  handleContextId,
  redirectToFirstTopic,
} from '../public/scripts/modules/redirect.js';

handleRedirect();

async function handleRedirect() {
  const contextRedirect = await handleContextId();
  if (!contextRedirect) {
    await redirectToFirstTopic();
  }
}
