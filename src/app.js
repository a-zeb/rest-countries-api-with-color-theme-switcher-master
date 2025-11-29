const themeButton = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const regionSelect = document.getElementById("region-select");
const grid = document.getElementById("country-grid");
const detail = document.getElementById("country-detail");
const backButton = document.getElementById("back-button");
let countries = [];
let selected = null;
let currentList = [];
const fallbackSeed = [
  {
    name: { common: "Fallback Country" },
    population: 1000000,
    region: "Nowhere",
    capital: ["Example City"],
    flags: { png: "", alt: "Placeholder flag" },
  },
];
const API_URL =
  "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags";

function start() {
  if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);
  }
  if (backButton) {
    backButton.addEventListener("click", showList);
  }
  setStatus("Loading local data.");
  loadLocalThenApi();
  bindFilters();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
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
      <div class="card h-100 country-card" data-index="${index}">
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
  });
}

function setStatus(text) {
  const existing = document.getElementById("status-message");
  if (existing) {
    existing.textContent = text;
    existing.classList.toggle("d-none", !text);
    return;
  }
  if (!text) return;
  const p = document.createElement("p");
  p.id = "status-message";
  p.className = "mt-3";
  p.textContent = text;
  grid?.parentElement?.appendChild(p);
}

function showDetail() {
  if (!detail || !selected) return;
  const flagEl = detail.querySelector(".detail-flag");
  const nameEl = detail.querySelector(".detail-name");
  const popEl = detail.querySelector(".detail-pop");
  const regionEl = detail.querySelector(".detail-region");
  const capitalEl = detail.querySelector(".detail-capital");

  if (flagEl) {
    flagEl.src = selected?.flags?.png || "";
    flagEl.alt = selected?.flags?.alt || "";
  }
  if (nameEl) nameEl.textContent = selected?.name?.common || "Unknown";
  if (popEl)
    popEl.textContent = selected?.population?.toLocaleString?.() || "-";
  if (regionEl) regionEl.textContent = selected?.region || "-";
  if (capitalEl) capitalEl.textContent = selected?.capital?.[0] || "-";

  detail.classList.remove("d-none");
  grid?.classList.add("d-none");
}

function showList() {
  detail?.classList.add("d-none");
  grid?.classList.remove("d-none");
  setStatus("");
}

start();
