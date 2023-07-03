import '../stylesheets/modules/internal.css';

export function addInternalBadge() {
  try {
    if (window.docInternal) {
      const internalBadge = document.createElement('div');
      internalBadge.setAttribute('id', 'internalBadge');
      const internalBadgeText = document.createElement('span');
      internalBadgeText.innerHTML = 'internal doc';
      internalBadgeText.setAttribute('class', 'internalBadgeText');
      const internalBadgeTooltip = document.createElement('span');
      internalBadgeTooltip.innerHTML =
        'This document is available only to people with a Guidewire email. Do not share the link with external stakeholders because they will not be able to see the contents.';
      internalBadgeTooltip.setAttribute('class', 'internalBadgeTooltip');
      internalBadge.appendChild(internalBadgeText);
      internalBadge.appendChild(internalBadgeTooltip);
      document.getElementById('headerRight').appendChild(internalBadge);
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}
