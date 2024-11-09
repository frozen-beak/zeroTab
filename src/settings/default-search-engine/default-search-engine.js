import { searchEngines } from "../../global.js";

document.addEventListener("DOMContentLoaded", () => {
  renderSearchEngines();
  initializeSelectedEngine();
  updateDefaultSearchEngine();
});

function renderSearchEngines() {
  const searchSection = document.getElementById("holder");

  searchEngines.forEach((engine) => {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("flex-row");
    mainDiv.style.alignItems = "center";
    mainDiv.style.margin = "8px 0px";

    // radio input
    const radio = document.createElement("input");

    radio.type = "radio";
    radio.name = "search";
    radio.style.height = "12px";

    radio.value = engine.name;
    radio.id = engine.name;

    // label
    const label = document.createElement("label");
    label.classList.add("body-1");
    label.htmlFor = engine.name;
    label.textContent = engine.name;
    label.style.marginLeft = "12px";

    mainDiv.appendChild(radio);
    mainDiv.appendChild(label);

    searchSection.appendChild(mainDiv);
  });
}

function updateDefaultSearchEngine() {
  const anchor = document.getElementById("update-search");

  anchor.addEventListener("click", function (event) {
    event.preventDefault();

    const selectedRadio = document.querySelector(
      'input[name="search"]:checked'
    );

    if (!selectedRadio) return;

    chrome.storage.sync.set({ searchEngine: selectedRadio.value });
    window.location.href = "../settings.html";
  });
}

function initializeSelectedEngine() {
  chrome.storage.sync.get("searchEngine", (data) => {
    const savedEngine = data.searchEngine;

    if (savedEngine) {
      const radioToSelect = document.querySelector(
        `input[name="search"][value="${savedEngine}"]`
      );

      if (radioToSelect) {
        radioToSelect.checked = true;
      }
    }
  });
}
