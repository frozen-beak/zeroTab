import { searchEngines } from "../global.js";

document.addEventListener("DOMContentLoaded", () => {
  renderSearchEngines();
});

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
