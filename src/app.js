const themeButton = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const regionSelect = document.getElementById("region-select");
const grid = document.getElementById("country-grid");
let countries = [];
const API_URL =
  "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags";

function start() {
  if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);
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
    setStatus("Could not load local data.");
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
  grid.innerHTML = "";
  if (!list.length) {
    setStatus("No countries found.");
    return;
  }
  list.forEach((country) => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card h-100">
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

start();
