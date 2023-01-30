import "../stylesheets/modules/searchBox.css";

function createInput(name, value, isHidden = true) {
  const input = document.createElement("input");
  if (isHidden) {
    input.setAttribute("type", "hidden");
  }
  input.setAttribute("name", name);
  input.setAttribute("value", value);

  return input;
}

export function addSearchBox() {
  const searchWrapper = document.createElement("div");
  searchWrapper.setAttribute("class", "searchWrapper");

  const searchFieldId = "searchField";

  const searchLabel = document.createElement("label");
  searchLabel.setAttribute("for", searchFieldId);
  searchLabel.classList.add("searchLabel");
  searchLabel.innerText = "Search";
  searchWrapper.appendChild(searchLabel);

  const searchInput = createInput("q", "", false);
  searchInput.setAttribute("id", searchFieldId);
  searchInput.setAttribute("class", searchFieldId);
  searchInput.setAttribute("type", "search");
  searchInput.setAttribute("placeholder", "Search");
  searchInput.setAttribute("aria-label", "Search phrase");
  searchWrapper.appendChild(searchInput);

  // Filters and their names must match filters in the displayOrder variable in searchController.js
  searchWrapper.appendChild(createInput("doc_title", window.docTitle));
  searchWrapper.appendChild(createInput("platform", window.docPlatform));
  searchWrapper.appendChild(createInput("product", window.docProduct));
  searchWrapper.appendChild(createInput("version", window.docVersion));
  window.docSubject &&
    searchWrapper.appendChild(createInput("subject", window.docSubject));

  const button = document.createElement("button");
  button.innerText = "Search";
  button.setAttribute("type", "submit");
  button.setAttribute("class", "searchButton");
  button.setAttribute("aria-label", "Submit search");
  searchWrapper.appendChild(button);

  const form = document.createElement("form");
  form.setAttribute("action", "/search");
  form.appendChild(searchWrapper);

  document.getElementById("headerCenter").appendChild(form);
}
