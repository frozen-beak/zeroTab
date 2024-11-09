import { searchEngines } from "./global.js";

document.addEventListener("DOMContentLoaded", () => {
  focusSearchTab();
  listenToSearchTab();
  searchListener();
});

var currentSearchEngine = undefined;

function loadDefaultSearchEngine() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("searchEngine", (data) => {
      const savedEngine = data.searchEngine;

      if (savedEngine) {
        const engine = searchEngines.find((e) => e.name === savedEngine);

        if (engine) {
          currentSearchEngine = engine;
        }
      }

      resolve();
    });
  });
}

function focusSearchTab() {
  const search = document.getElementById("search-input");
  search.focus();
}

function listenToSearchTab() {
  const search = document.getElementById("search-input");

  search.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      updateTag(search.value);
    } else if (event.key === "Backspace") {
      clearTag(search.value);
    }
  });
}

function updateTag(input) {
  const tag = document.getElementById("search-tag");
  const parts = input.trim().split(" ");

  if (parts.length == 0 || !parts[0].startsWith(":")) return;

  const command = parts[0].substring(1);
  const engine = searchEngines.find((e) => e.shortcut === command);

  if (engine) {
    tag.textContent = `Search ${engine.name} | `;
    tag.style.marginRight = "8px";

    // update the current selected search engine
    currentSearchEngine = engine;

    // Clear the input for the user query
    clearInput();
  }
}

function clearTag(input) {
  const tag = document.getElementById("search-tag");

  if (input.length === 0) {
    tag.textContent = "";
    tag.style.marginRight = "0px";
  }
}

function clearInput() {
  const search = document.getElementById("search-input");

  search.value = "";
}

async function searchListener(input) {
  const form = document.getElementById("search-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const search = document.getElementById("search-input");

    if (currentSearchEngine == undefined) {
      await loadDefaultSearchEngine();
    }

    const url = currentSearchEngine.url.replace(
      "%s",
      encodeURIComponent(search.value)
    );

    window.open(url, "_self");
  });
}
