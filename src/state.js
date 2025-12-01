export const state = {
  countries: [],
  filtered: [],
  selected: null,
};

export function setCountries(list) {
  state.countries = Array.isArray(list) ? list : [];
}

export function setFiltered(list) {
  state.filtered = Array.isArray(list) ? list : [];
}

export function setSelected(country) {
  state.selected = country || null;
}
