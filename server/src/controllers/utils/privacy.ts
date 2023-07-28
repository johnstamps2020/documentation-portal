// These functions are repeated in the Pendo initialize script. However,
// I can't import them from there because that file is meant as a text
// template to be sent to the browser. We cannot add any exports in that
// file.
function scramble(phrase: string) {
  let hash = 0,
    i,
    chr;
  if (phrase.length === 0) return hash;
  for (i = 0; i < phrase.length; i++) {
    chr = phrase.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export function getScrambledEmail(email: string) {
  const parts = email?.includes('@') ? email.split('@') : [];
  if (parts.length === 2) {
    const scrambledLogin = scramble(parts[0]);
    return `${scrambledLogin}@${parts[1]}`;
  }

  return 'cannot.get.email@unknown.com';
}
