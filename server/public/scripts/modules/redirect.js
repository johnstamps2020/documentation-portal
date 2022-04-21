export async function redirectToFirstTopic() {
    const firstLink = document.querySelector(".topicref > a");
    if(firstLink === null) {
        console.error('Error: No first topic reference to redirect to.');
        return;
    }
    window.location.href = firstLink.getAttribute("href");
}

export async function handleContextId() {
    const queryString = window.location.search;
    if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        const contextId = urlParams.get('contextId');
        if (contextId) {
            const redirected = await redirectToId(contextId);
            return redirected;
        }
    }
    else return false;
}

async function redirectToId(contextId) {
    try {
        const response = await fetch('./contextIds.json');
        if (!response.ok) {
                throw new Error("HTTP error: " + response.status);
                return false;
        }
        else {
            const json = await response.json();
            const filesWithIds = json.contextIds;
            const entry = filesWithIds.find(element => element.ids.includes(contextId));

            if (entry) {
                window.location.href = './' + entry.file + '#' + contextId;
                return true;
            }
            else {
                console.log("ERROR: Invalid contextId")
                return false;
            } 
        }
    }
    catch(e) {
        console.error("Error fetching contextIds.json: ", e);
        return false;
    }
}