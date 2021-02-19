function selectToggleButton() {
  const toggleButtons = document.querySelectorAll('#cloudToggle > a');
  for (const button of toggleButtons) {
    const root = button.getAttribute('data-root');
    const currentPath = window.location.pathname;
    if (currentPath.startsWith(root)) {
      button.classList.toggle('selected');
    }
  }
}

window.onload = function() {
  console.log('DOCUMENT LOADED');
  selectToggleButton();
};
