function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function() {
    const addressEnd = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    console.log('ADDRESS', addressEnd);

    const linkToThisPage = document.querySelector(`li a[href$="${addressEnd}"`);
    if (linkToThisPage) {
        linkToThisPage.classList.toggle('selected');
    }
});
