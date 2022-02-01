const availableExternalSites = [
  {
    label: 'Customer Community',
    url: 'https://community.guidewire.com/s/login',
  },
  {
    label: 'Partner Portal',
    url: 'https://partner.guidewire.com/s/login',
  },
  {
    label: 'Developer',
    url: 'https://developer.guidewire.com',
  },
  {
    label: 'Education',
    url:
      'https://ilearning.seertechsolutions.com/lmt/xlr8login.login?site=guidewire',
  },
  {
    label: 'Guidewire Website',
    url: 'https://www.guidewire.com',
  },
];

function showExternalSitesMenu(event) {
  if (event.target.id === 'externalSitesButton') {
    const externalSitesMenu = document.getElementById('externalSitesMenu');
    externalSitesMenu.classList.toggle('show');
  }
}

function closeExternalSitesMenu(event) {
  if (!event.target.closest('#externalSitesButton')) {
    const externalSitesMenu = document.getElementById('externalSitesMenu');
    if (externalSitesMenu.classList.contains('show')) {
      externalSitesMenu.classList.remove('show');
    }
  }
}

export function createExternalSites() {
  const externalSitesMenuActions = document.createElement('div');
  externalSitesMenuActions.setAttribute('class', 'externalSitesMenuActions');
  availableExternalSites.forEach(s => {
    const externalSite = document.createElement('div');
    externalSite.setAttribute('class', 'externalSite');
    const translatedPageLink = document.createElement('a');
    translatedPageLink.setAttribute('href', s.url);
    translatedPageLink.setAttribute('rel', 'noopener noreferrer');
    translatedPageLink.setAttribute('target', '_blank');
    translatedPageLink.innerHTML = s.label;
    externalSite.appendChild(translatedPageLink);
    externalSitesMenuActions.appendChild(externalSite);
  });

  const externalSitesHeader = document.createElement('div');
  externalSitesHeader.setAttribute('class', 'externalSitesHeader');
  externalSitesHeader.innerHTML = 'Guidewire Sites';

  const externalSitesDivider = document.createElement('hr');
  externalSitesDivider.setAttribute('class', 'externalSitesDivider');

  const externalSitesMenu = document.createElement('div');
  externalSitesMenu.setAttribute('class', 'externalSitesMenu');
  externalSitesMenu.setAttribute('id', 'externalSitesMenu');
  externalSitesMenu.appendChild(externalSitesHeader);
  externalSitesMenu.appendChild(externalSitesDivider);
  externalSitesMenu.appendChild(externalSitesMenuActions);

  const externalSitesButton = document.createElement('button');
  externalSitesButton.setAttribute('id', 'externalSitesButton');
  externalSitesButton.setAttribute('aria-label', 'external sites');
  externalSitesButton.addEventListener('click', showExternalSitesMenu);
  window.addEventListener('click', closeExternalSitesMenu);
  externalSitesButton.appendChild(externalSitesMenu);

  const externalSites = document.createElement('div');
  externalSites.setAttribute('id', 'externalSites');
  externalSites.appendChild(externalSitesButton);

  document.getElementById('externalSitesContainer').appendChild(externalSites);
}
