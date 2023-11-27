export function getRedirectToPath() {
  return window.location.href
    .replace(window.location.origin, '')
    .replaceAll('&', '%26');
}
