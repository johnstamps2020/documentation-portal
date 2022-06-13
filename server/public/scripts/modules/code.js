import '../../stylesheets/modules/code.css';
import { highlightAll } from 'prismjs';

function languageIsSet(elem) {
  return !!elem.closest("*[class^='language-'], *[class*=' language-']");
}

export function normalizeCode() {
  const codeBlocks = document.querySelectorAll('pre.pre');
  for (const codeBlock of codeBlocks) {
    codeBlock.parentElement.classList.add('match-braces');
    if (!languageIsSet(codeBlock)) {
      codeBlock.classList.add('language-java');
    }
  }
}

export function highlightCode() {
  const codeBlocks = document.querySelectorAll('pre');

  if (codeBlocks.length > 0) {
    highlightAll();
  }
}
