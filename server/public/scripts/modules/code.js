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
      function copyToClipBoard(e) {
        e.target.classList.add('active');
        var copyText = block.innerText;
        navigator.clipboard.writeText(copyText);
        setInterval(function() {
          e.target.classList.remove('active');
        }, 500);
      }

      const copyButton = document.createElement('button');
      copyButton.setAttribute('aria-label', 'Copy code to clipboard');
      copyButton.classList.add('copyToClipboardButton');
      copyButton.type = 'button';
      copyButton.tabIndex = 0;
      copyButton.innerText = 'copy';

      copyButton.addEventListener('click', copyToClipBoard);

      const wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('codeBlockWrapper');
      block.before(wrapperDiv);
      wrapperDiv.appendChild(block);
      wrapperDiv.appendChild(copyButton);
    }
  }
}
