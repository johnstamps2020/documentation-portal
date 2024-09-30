export function getRedirectToPath() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return window.location.href
    ?.replace(window.location.origin, '')
    ?.replace(/&/g, '%26');
}

export function navigateWithUpdatedParams(updatedParams: URLSearchParams) {
  const updatedUrl = new URL(window.location.href);

  updatedUrl.search = updatedParams.toString();
  window.location.href = updatedUrl.toString();
}
