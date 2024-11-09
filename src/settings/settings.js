import { searchEngines } from "../global.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeSelectedEngine();
  renderSearchEngines();
  getBackToNewTab();
});

function getBackToNewTab() {
  const anchor = document.getElementById("get-back");

  anchor.addEventListener("click", function (event) {
    event.preventDefault();
    chrome.tabs.create({ url: "chrome://newtab/" });
  });
}

function initializeSelectedEngine() {
  chrome.storage.sync.get("searchEngine", (data) => {
    const savedEngine = data.searchEngine;

    if (savedEngine) {
      // Find the engine in the searchEngines list
      const engine = searchEngines.find((e) => e.name === savedEngine);

      if (engine) {
        // Update the default search engine div
        const defaultSearchEngineDiv = document.getElementById(
          "default-search-engine"
        );

        // Update image src and alt
        const img = defaultSearchEngineDiv.querySelector("img");
        img.src = engine.icon;
        img.alt = engine.name;

        // Update the search engine name
        const nameElement = defaultSearchEngineDiv.querySelector("p");
        nameElement.textContent = engine.name;
      }
    }
  });
}

function renderSearchEngines() {
  const searchSection = document.getElementById("search-table");

  searchSection.innerHTML = "";

  const finalIndex = searchEngines.length - 1;

  searchEngines.forEach((engine, index) => {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("search-table", "title-2");

    const secDiv = document.createElement("div");
    secDiv.classList.add("flex-row");
    secDiv.style.marginLeft = "16px";

    const img = document.createElement("img");
    img.src = engine.icon;
    img.alt = engine.name;
    img.width = 20;
    img.height = 20;

    const spaceDiv = document.createElement("div");
    spaceDiv.classList.add("space-w-2");

    const title = document.createElement("p");
    title.textContent = engine.name;

    secDiv.appendChild(img);
    secDiv.appendChild(spaceDiv);
    secDiv.appendChild(title);

    const shortcut = document.createElement("p");
    shortcut.textContent = ":" + engine.shortcut;
    shortcut.style.textAlign = "end";
    shortcut.style.marginRight = "16px";

    mainDiv.appendChild(secDiv);
    mainDiv.appendChild(shortcut);

    // divider
    const hr = document.createElement("hr");
    hr.classList.add("search-divider");

    searchSection.appendChild(mainDiv);

    if (index < finalIndex) {
      searchSection.appendChild(hr);
    }
  });
}
