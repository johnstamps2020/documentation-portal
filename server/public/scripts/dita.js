function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function expandTree(startingElement) {
  startingElement.classList.toggle('expanded');
  const childList = startingElement.querySelector('ul');
  if (childList) {
    childList.classList.toggle('expanded');
  }
  let startingElementsParent = startingElement.parentElement;
  while (startingElementsParent && startingElementsParent.tagName !== 'nav') {
    startingElementsParent.classList.toggle('expanded');
    startingElementsParent = startingElementsParent.parentElement;
  }
}

docReady(function() {
  const addressEnd = window.location.href.substring(
    window.location.href.lastIndexOf('/') + 1
  );

  const linkToThisPage = document.querySelector(`li a[href$="${addressEnd}"`);
  if (linkToThisPage) {
    linkToThisPage.classList.toggle('selectedNavItem');
  }

  const nestedLists = document.querySelectorAll('li > ul');
  nestedLists.forEach(list => {
    list.classList.toggle('nested');
    const parentLi = list.parentElement;
    parentLi.classList.toggle('caret');
  });

  const activeLi = document.querySelector('nav[role="toc"] .selectedNavItem');
  if (activeLi) {
    expandTree(activeLi.parentElement);
  }

  const nonLinkingNavElements = document.querySelectorAll(
    'nav[role="toc"] span'
  );
  nonLinkingNavElements.forEach(span => {
    span.addEventListener('click', function() {
      console.log('You clicked me', this);
      const clickedLi = this.parentElement;
      expandTree(clickedLi);
    });
  });
});
