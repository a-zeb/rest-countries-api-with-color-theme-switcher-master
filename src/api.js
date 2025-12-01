export const API_URL =
  "https://restcountries.com/v3.1/all?fields=name,population,region,subregion,capital,flags,borders,cca3,languages,currencies";

export async function fetchFromApi() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("API request failed");
  return res.json();
}

export async function fetchLocalData() {
  const res = await fetch("./data.json");
  if (!res.ok) throw new Error("Local data missing");
  return res.json();
}
