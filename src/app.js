const themeButton = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const regionSelect = document.getElementById("region-select");
const grid = document.getElementById("country-grid");
const detail = document.getElementById("country-detail");
const backButton = document.getElementById("back-button");
let countries = [];
let selected = null;
let currentList = [];
const API_URL =
  "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,borders,cca3";
const THEME_KEY = "theme-choice";
const FILTER_KEY = "filters";
const fallbackSeed = [
  {
    name: { common: "Fallback Country" },
    population: 1000000,
    region: "Nowhere",
    capital: ["Example City"],
    flags: { png: "", alt: "Placeholder flag" },
    borders: [],
    cca3: "FAL",
  },
];

function start() {
  if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);
  }
  loadSavedPrefs();
  if (backButton) {
    backButton.addEventListener("click", showList);
  }
  setStatus("Loading local data.");
  loadLocalThenApi();
  bindFilters();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const currentTheme = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  localStorage.setItem(THEME_KEY, currentTheme);
}

function bindFilters() {
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
  if (regionSelect) {
    regionSelect.addEventListener("change", applyFilters);
  }
}

async function loadLocalThenApi() {
  await loadLocalData();
  loadApiData();
}

async function loadLocalData() {
  try {
    const fallback = await fetch("./data.json");
    countries = await fallback.json();
    applyFilters();
    setStatus("Loaded local data while updating from API.");
  } catch (err) {
    countries = fallbackSeed;
    applyFilters();
    setStatus("Using built-in sample data.");
  }
}

async function loadApiData() {
  try {
    const response = await fetch(API_URL);
    countries = await response.json();
    applyFilters();
    setStatus("Loaded from API.");
  } catch (error) {
    try {
      setStatus("Using local data to combat slow API.");
    } catch (err) {
      setStatus("Could not load countries.");
    }
  }
}

function applyFilters() {
  const term = searchInput?.value.trim().toLowerCase() || "";
  const region = regionSelect?.value || "";
  if (term.length > 50) {
    setStatus("Search is too long.");
    return;
  }
  const filtered = countries.filter((item) => {
    const matchesName = item?.name?.common?.toLowerCase().includes(term);
    const matchesRegion = region ? item.region === region : true;
    return matchesName && matchesRegion;
  });
  saveFilters();
  renderCountries(filtered);
}

function renderCountries(list) {
  if (!grid) return;
  currentList = list;
  grid.innerHTML = "";
  if (!list.length) {
    setStatus("No countries found.");
    return;
  }
  setStatus("");
	  list.forEach((country, index) => {
	    const col = document.createElement("div");
	    col.className = "col";
	    col.innerHTML = `
	      <div class="card h-100 country-card" data-index="${index}" role="button" tabindex="0">
	        <div class="ratio ratio-4x3 bg-light border-bottom">
	          <img src="${country?.flags?.png || ""}" alt="${
	      country?.flags?.alt || ""
	    }" class="w-100 h-100 object-fit-cover" />
	        </div>
        <div class="card-body">
          <h2 class="h6 card-title mb-2">${
            country?.name?.common || "Unknown"
          }</h2>
          <p class="small mb-1">Population: ${
            country?.population?.toLocaleString?.() || "-"
          }</p>
          <p class="small mb-1">Region: ${country?.region || "-"}</p>
          <p class="small mb-0">Capital: ${country?.capital?.[0] || "-"}</p>
        </div>
      </div>
    `;
    grid.appendChild(col);
	  });
	  grid.querySelectorAll(".country-card").forEach((card) => {
	    card.addEventListener("click", () => {
	      const idx = Number(card.getAttribute("data-index"));
	      selected = currentList[idx] || null;
	      showDetail();
	    });
	    card.addEventListener("keydown", (e) => {
	      if (e.key === "Enter" || e.key === " ") {
	        e.preventDefault();
	        const idx = Number(card.getAttribute("data-index"));
	        selected = currentList[idx] || null;
	        showDetail();
	      }
	    });
	  });
	}

function setStatus(text) {
  const existing = document.getElementById("status-message");
  if (!existing) return;
  existing.textContent = text;
  existing.classList.toggle("d-none", !text);
}

function showDetail() {
  if (!detail || !selected) return;
  const flagEl = detail.querySelector(".detail-flag");
  const nameEl = detail.querySelector(".detail-name");
  const popEl = detail.querySelector(".detail-pop");
  const regionEl = detail.querySelector(".detail-region");
  const capitalEl = detail.querySelector(".detail-capital");
  const bordersEl = detail.querySelector(".detail-borders");

  if (flagEl) {
    flagEl.src = selected?.flags?.png || "";
    flagEl.alt = selected?.flags?.alt || "";
  }
  if (nameEl) nameEl.textContent = selected?.name?.common || "Unknown";
  if (popEl)
    popEl.textContent = selected?.population?.toLocaleString?.() || "-";
  if (regionEl) regionEl.textContent = selected?.region || "-";
  if (capitalEl) capitalEl.textContent = selected?.capital?.[0] || "-";
  if (bordersEl) {
    bordersEl.innerHTML = "";
    const codes = selected?.borders || [];
    if (!codes.length) {
      bordersEl.textContent = "None";
    } else {
      codes.forEach((code) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-secondary btn-sm";
        btn.textContent = code;
        btn.addEventListener("click", () => pickByCode(code));
        bordersEl.appendChild(btn);
      });
    }
  }

  detail.classList.remove("d-none");
  grid?.classList.add("d-none");
}

function showList() {
  detail?.classList.add("d-none");
  grid?.classList.remove("d-none");
  setStatus("");
}

function pickByCode(code) {
  if (!code) return;
  const found = countries.find(
    (c) => c?.cca3?.toLowerCase() === code.toLowerCase()
  );
  if (found) {
    selected = found;
    showDetail();
  }
}

function loadSavedPrefs() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
  const savedFilters = localStorage.getItem(FILTER_KEY);
  if (savedFilters) {
    try {
      const parsed = JSON.parse(savedFilters);
      if (searchInput && typeof parsed.term === "string") {
        searchInput.value = parsed.term;
      }
      if (regionSelect && typeof parsed.region === "string") {
        regionSelect.value = parsed.region;
      }
    } catch (e) {
      // ignore bad data
    }
  }
}

function saveFilters() {
  const data = {
    term: searchInput?.value || "",
    region: regionSelect?.value || "",
  };
  localStorage.setItem(FILTER_KEY, JSON.stringify(data));
}

start();
