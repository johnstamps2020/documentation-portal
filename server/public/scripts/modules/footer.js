const footerTemplate = `<div>
    <div class="footerLinks">
        <span class="footerLink">
            <a href="/support">Legal and Support Information</a>
        </span>
    </div>
    <div class="footerCopyright">
        Copyright © 2001-${new Date().getFullYear()}
        Guidewire Software, Inc.
    </div>
</div>`;

export function addFooterContents() {
  const footerRight = document.getElementById('footerRight');
  footerRight.innerHTML = footerTemplate;
}
