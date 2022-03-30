import Prism from 'prismjs';
import '../../stylesheets/modules/code.css';

function containsLanguageClass(arr) {
  return arr.some(
    item => item.startsWith('language-') || item.startsWith('lang-')
  );
}

export function normalizeCode() {
  const codeBlocks = document.querySelectorAll('pre.pre');
  for (const codeBlock of codeBlocks) {
    codeBlock.parentElement.classList.add('match-braces');
    if (!containsLanguageClass([...codeBlock.classList])) {
      codeBlock.classList.add('language-java');
    }
  }
}

export async function highlightCode() {
  const codeBlocks = document.querySelectorAll('pre');

  if (codeBlocks.length > 0) {
    Prism.highlightAll();
  }
}
