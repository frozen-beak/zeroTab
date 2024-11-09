import { searchEngines } from "./global.js";

document.addEventListener("DOMContentLoaded", () => {
  listenToSearchTab();
  searchListener();

  updateSysInfoAtInterval();
  listenToKeyBindings();
});

var currentSearchEngine = undefined;

function listenToKeyBindings() {
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
      focusSearchTab();
    }
  });
}

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

    if (isValidURL(search.value)) {
      const url = "https://" + search.value;
      window.open(url, "_self");
    } else {
      const url = currentSearchEngine.url.replace(
        "%s",
        encodeURIComponent(search.value)
      );

      window.open(url, "_self");
    }

    currentSearchEngine = undefined;
  });
}

function isValidURL(str) {
  const regex = /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/i;
  return regex.test(str);
}

function updateSysInfoAtInterval() {
  updateTime();
  updateDate();
  updateDay();

  setInterval(() => {
    updateTime();
  }, 1000);
}

function updateTime() {
  const element = document.getElementById("time");
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let amPm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour time to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 12 AM is 12, not 0
  minutes = minutes < 10 ? "0" + minutes : minutes;

  element.innerHTML = `󰔟 ${hours}:${minutes} ${amPm}`;
}

function updateDay() {
  const element = document.getElementById("day");
  const now = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = daysOfWeek[now.getDay()];

  element.innerHTML = `&#xf4df; ${day}`;
}

function updateDate() {
  const element = document.getElementById("date");
  const now = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[now.getMonth()];
  const day = now.getDate();

  element.innerHTML = `󰁥 ${month} ${day < 10 ? "0" + day : day}`;
}
