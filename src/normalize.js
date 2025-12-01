export function normalizeCountry(raw) {
  if (!raw) return null;
  if (raw?.name?.common) {
    // from the API
    return {
      code: raw.cca3 || "",
      name: raw.name.common || "",
      nativeName: pickNative(raw.name.nativeName),
      population: raw.population || 0,
      region: raw.region || "",
      subregion: raw.subregion || "",
      capital: raw.capital?.[0] || "",
      tld: raw.tld || [],
      currencies: listCurrencies(raw.currencies),
      languages: listLanguages(raw.languages),
      borders: raw.borders || [],
      flag: raw.flags?.png || "",
      flagAlt: raw.flags?.alt || "",
    };
  }

  // from data.json
  return {
    code: raw.alpha3Code || "",
    name: raw.name || "",
    nativeName: raw.nativeName || "",
    population: raw.population || 0,
    region: raw.region || "",
    subregion: raw.subregion || "",
    capital: raw.capital || "",
    tld: raw.topLevelDomain || [],
    currencies: Array.isArray(raw.currencies)
      ? raw.currencies.map((c) => c.name).filter(Boolean)
      : [],
    languages: Array.isArray(raw.languages)
      ? raw.languages.map((l) => l.name || l).filter(Boolean)
      : [],
    borders: raw.borders || [],
    flag: raw.flags?.png || raw.flag || "",
    flagAlt: "",
  };
}

function pickNative(nativeName) {
  if (!nativeName) return "";
  const first = Object.values(nativeName)[0];
  return first?.common || first?.official || "";
}

function listCurrencies(currencies) {
  if (!currencies) return [];
  return Object.values(currencies)
    .map((c) => c?.name)
    .filter(Boolean);
}

function listLanguages(languages) {
  if (!languages) return [];
  return Object.values(languages).filter(Boolean);
}
