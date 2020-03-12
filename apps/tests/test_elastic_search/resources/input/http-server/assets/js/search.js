const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchField');

if (searchButton) {
    searchButton.addEventListener('click', function() {
        const searchPhrase = encodeURIComponent(searchInput.value);
        const targetUrl = encodeURI(`/search?q=${searchPhrase}`);
        window.location.href = targetUrl;
    });
} else {
    console.log('~Cannot find search button');
}
if (searchInput) {
    searchInput.addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchButton').click();
        }
    });
} else {
    console.log('~Cannot find search input');
}