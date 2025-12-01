const grid = document.getElementById("country-grid");
const detail = document.getElementById("country-detail");
const statusEl = document.getElementById("status-message");

export function renderList(list, onSelect) {
  if (!grid) return;
  grid.innerHTML = "";
  if (!list || !list.length) {
    setStatus("No countries found.");
    return;
  }
  setStatus("");
  list.forEach((country) => {
    // build each card and wire click/keyboard to open detail
    const card = buildCard(country);
    card.addEventListener("click", () => onSelect(country.code));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(country.code);
      }
    });
    grid.appendChild(wrapCol(card));
  });
}

export function renderDetail(country, onBorderClick) {
  if (!detail || !country) return;
  // fill the detail view with selected country data
  detail.querySelector(".detail-flag").src = country.flag || "";
  detail.querySelector(".detail-flag").alt = country.flagAlt || "";
  detail.querySelector(".detail-name").textContent = country.name || "Unknown";
  detail.querySelector(".detail-native").textContent =
    country.nativeName || "-";
  detail.querySelector(".detail-pop").textContent =
    country.population?.toLocaleString?.() || "-";
  detail.querySelector(".detail-region").textContent = country.region || "-";
  detail.querySelector(".detail-subregion").textContent =
    country.subregion || "-";
  detail.querySelector(".detail-capital").textContent = country.capital || "-";
  detail.querySelector(".detail-tld").textContent =
    (country.tld || []).join(", ") || "-";
  detail.querySelector(".detail-currencies").textContent = listToText(
    country.currencies
  );
  detail.querySelector(".detail-languages").textContent = listToText(
    country.languages
  );

  const bordersEl = detail.querySelector(".detail-borders");
  bordersEl.innerHTML = "";
  const borders = country.borders || [];
  if (!borders.length) {
    bordersEl.textContent = "None";
  } else {
    // build border buttons
    borders.forEach(({ code, name }) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-secondary btn-sm";
      btn.textContent = name || code;
      btn.addEventListener("click", () => onBorderClick(code));
      bordersEl.appendChild(btn);
    });
  }

  detail.classList.remove("d-none");
  grid?.classList.add("d-none");
}

export function showListView() {
  detail?.classList.add("d-none");
  grid?.classList.remove("d-none");
  setStatus("");
}

export function setStatus(text) {
  if (!statusEl) return;
  statusEl.textContent = text || "";
  statusEl.classList.toggle("d-none", !text);
}

function buildCard(country) {
  // simple card markup for the grid
  const card = document.createElement("div");
  card.className = "card h-100 country-card";
  card.tabIndex = 0;

  const flagWrap = document.createElement("div");
  flagWrap.className = "ratio ratio-4x3 bg-light border-bottom";

  const img = document.createElement("img");
  img.src = country.flag || "";
  img.alt = country.flagAlt || "";
  img.className = "w-100 h-100 object-fit-cover";
  flagWrap.appendChild(img);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h2");
  title.className = "h6 card-title mb-2";
  title.textContent = country.name || "Unknown";

  const pop = document.createElement("p");
  pop.className = "small mb-1";
  pop.innerHTML = `<strong>Population:</strong> ${formatNumber(
    country.population
  )}`;

  const region = document.createElement("p");
  region.className = "small mb-1";
  region.innerHTML = `<strong>Region:</strong> ${country.region || "-"}`;

  const capital = document.createElement("p");
  capital.className = "small mb-0";
  capital.innerHTML = `<strong>Capital:</strong> ${country.capital || "-"}`;

  body.append(title, pop, region, capital);
  card.append(flagWrap, body);
  return card;
}

function wrapCol(node) {
  const col = document.createElement("div");
  col.className = "col";
  col.appendChild(node);
  return col;
}

function formatNumber(num) {
  return typeof num === "number" ? num.toLocaleString() : "-";
}

function listToText(list) {
  return Array.isArray(list) && list.length ? list.join(", ") : "-";
}
