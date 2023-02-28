import './html5skip.css';

import { handleContextId, redirectToFirstTopic } from '../modules/redirect';

handleRedirect();

async function handleRedirect() {
  const contextRedirect = await handleContextId();
  if (!contextRedirect) {
    await redirectToFirstTopic();
  }
}
