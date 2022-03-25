import Prism from 'prismjs';

function containsLanguageClass(arr) {
  return arr.some(
    item => item.startsWith('language-') || item.startsWith('lang-')
  );
}

export function normalizeCode() {
  const codeBlocks = document.querySelectorAll('pre > code');
  for (const codeBlock of codeBlocks) {
    codeBlock.parentElement.classList.add('line-numbers');
    if (!containsLanguageClass([...codeBlock.classList])) {
      codeBlock.classList.add('language-java');
    }
  }
}

export function addCopyButton() {
  const codeBlocks = document.querySelectorAll('pre.pre');
  if (codeBlocks && codeBlocks.length > 0) {
    for (const block of codeBlocks) {
      const copyButton = document.createElement('button');

      function copyToClipBoard(e) {
        e.target.classList.add('active');
        copyButton.innerText = '';
        var copyText = block.innerText.trim();
        navigator.clipboard.writeText(copyText);
        copyButton.innerText = 'copied';
        setInterval(function() {
          e.target.classList.remove('active');
        }, 500);
      }

      copyButton.setAttribute('aria-label', 'Copy code to clipboard');
      copyButton.classList.add('copyToClipboardButton');
      copyButton.type = 'button';
      copyButton.tabIndex = 0;
      copyButton.innerText = 'copy';

      copyButton.addEventListener('click', copyToClipBoard);

      block.before(copyButton);
    }
  }
}

export function highlightCode() {
  const codeBlocks = document.querySelectorAll('pre');

  if (codeBlocks.length > 0) {
    Prism.highlightAll();
  }
}
