import { fetchFromApi, fetchLocalData } from "./api.js";
import { normalizeCountry } from "./normalize.js";
import { renderList, renderDetail, showListView, setStatus } from "./render.js";
import { state, setCountries, setFiltered, setSelected } from "./state.js";

const themeButton = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const regionSelect = document.getElementById("region-select");
const backButton = document.getElementById("back-button");
const THEME_KEY = "theme-choice";
const FILTER_KEY = "filters";

function start() {
  bindTheme();
  bindFilters();
  bindBackButton();
  loadSavedPrefs();
  // load local first, then remote
  loadData();
}

function bindTheme() {
  if (!themeButton) return;
  themeButton.addEventListener("click", toggleTheme);
}

function bindFilters() {
  searchInput?.addEventListener("input", applyFilters);
  regionSelect?.addEventListener("change", applyFilters);
}

function bindBackButton() {
  backButton?.addEventListener("click", showListView);
}

async function loadData() {
  setStatus("Loading local data...");
  await loadLocal();
  loadRemote();
}

async function loadLocal() {
  try {
    const raw = await fetchLocalData();
    const list = raw.map(normalizeCountry).filter(Boolean);
    setCountries(list);
    applyFilters();
    setStatus("Loaded local data.");
  } catch (e) {
    setStatus("Could not load local data.");
  }
}

async function loadRemote() {
  try {
    // try API but keep the page working if it fails
    const raw = await fetchFromApi();
    const list = Array.isArray(raw)
      ? raw.map(normalizeCountry).filter(Boolean)
      : [];
    setCountries(list);
    applyFilters();
    setStatus("Loaded from API.");
  } catch (e) {
    setStatus("Using local data (API failed).");
  }
}

function applyFilters() {
  // re-render when search or region changes
  const term = searchInput?.value.trim().toLowerCase() || "";
  const region = regionSelect?.value || "";
  if (term.length > 50) {
    setStatus("Search is too long.");
    return;
  }
  // return countries that match the search and region
  const filtered = state.countries.filter((item) => {
    const matchesName = item?.name?.toLowerCase().includes(term);
    const matchesRegion = region ? item.region === region : true;
    return matchesName && matchesRegion;
  });
  setFiltered(filtered);
  saveFilters();
  renderList(filtered, handleSelect);
}

function handleSelect(code) {
  // find the chosen country and open the detail view
  const found = state.countries.find(
    (c) => c.code && c.code.toLowerCase() === code.toLowerCase()
  );
  setSelected(found || null);
  if (!state.selected) return;
  const borders = mapBorders(state.selected.borders);
  renderDetail({ ...state.selected, borders }, pickByCode);
}

function pickByCode(code) {
  handleSelect(code);
}

function mapBorders(codes) {
  if (!codes || !codes.length) return [];
  // map border codes to names for the buttons
  return codes.map((code) => {
    const match = state.countries.find(
      (c) => c.code && c.code.toLowerCase() === code.toLowerCase()
    );
    return { code, name: match?.name || code };
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const current = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  localStorage.setItem(THEME_KEY, current);
}

function loadSavedPrefs() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
  const savedFilters = localStorage.getItem(FILTER_KEY);
  if (savedFilters) {
    try {
      const parsed = JSON.parse(savedFilters);
      if (searchInput && parsed.term) searchInput.value = parsed.term;
      if (regionSelect && parsed.region) regionSelect.value = parsed.region;
    } catch (e) {
      console.log("Could not parse saved filters: ", e);
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
