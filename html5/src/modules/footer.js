import '../stylesheets/modules/footer.css';

export function addFooterContents(isOffline) {
  const footerTemplate = `<div>
        <div class="footerLinks">
            <span class="footerLink">
                <a href="${isOffline && 'https://docs.guidewire.com'}/support"${
    isOffline && 'target="__blank" rel="noopener noreferrer"'
  }>Legal and Support Information</a>
            </span>
        </div>
        <div class="footerCopyright">
            Copyright ©${new Date().getFullYear()}
            Guidewire Software, Inc.
        </div>
    </div>`;

  const footerRight = document.getElementById('footerRight');
  footerRight.innerHTML = footerTemplate;
}
