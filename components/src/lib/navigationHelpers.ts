export function getRedirectToPath() {
  if (typeof window === undefined) {
    return '/';
  }

  return window.location.href
    ?.replace(window.location.origin, '')
    ?.replace(/&/g, '%26');
}
