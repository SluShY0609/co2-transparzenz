"use strict";

/**
 * FIKTIVE DATEN (Demo)
 * Einheit co2: Megatonnen pro Jahr (Mt/Jahr)
 */
const DATA = [
  { land: "Deutschland", unternehmen: "EcoSteel AG", co2: 12.4, jahr: 2024 },
  { land: "Deutschland", unternehmen: "RheinPower GmbH", co2: 18.1, jahr: 2024 },
  { land: "Frankreich", unternehmen: "NordCement SA", co2: 9.7, jahr: 2024 },
  { land: "Frankreich", unternehmen: "BlueGrid Énergie", co2: 6.2, jahr: 2023 },
  { land: "USA", unternehmen: "SunOil Corp", co2: 44.2, jahr: 2024 },
  { land: "USA", unternehmen: "MegaLogistics Inc", co2: 21.5, jahr: 2023 },
  { land: "Japan", unternehmen: "Kanto Chemicals", co2: 14.9, jahr: 2024 },
  { land: "Japan", unternehmen: "ShinTech Motors", co2: 11.3, jahr: 2023 },
  { land: "Indien", unternehmen: "Bharat Energy", co2: 39.6, jahr: 2024 },
  { land: "Indien", unternehmen: "GreenBuild Ltd.", co2: 16.8, jahr: 2023 },
  { land: "Brasilien", unternehmen: "Amazon Transportes", co2: 8.3, jahr: 2024 },
  { land: "Brasilien", unternehmen: "BioFuel do Sul", co2: 5.9, jahr: 2023 },
];

// DOM: RTL/LTR
const dirToggle = document.getElementById("dirToggle");
const localMenu = document.getElementById("localMenu");
const contentArea = document.getElementById("contentArea");

// DOM: Tabelle / Filter
const tableBody = document.getElementById("tableBody");
const resultCount = document.getElementById("resultCount");

const searchCompany = document.getElementById("searchCompany");
const filterCountry = document.getElementById("filterCountry");
const sortBy = document.getElementById("sortBy");
const toggleSortDir = document.getElementById("toggleSortDir");
const resetBtn = document.getElementById("resetBtn");

// Zustand
let sortAscending = true;

/* ---------------------------
   RTL/LTR (Anforderung c)
---------------------------- */
function applyDir(isRtl) {
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");

  localMenu.classList.remove("order-md-1", "order-md-2");
  contentArea.classList.remove("order-md-1", "order-md-2");

  if (isRtl) {
    localMenu.classList.add("order-md-2");
    contentArea.classList.add("order-md-1");
  } else {
    localMenu.classList.add("order-md-1");
    contentArea.classList.add("order-md-2");
  }
}

/* ---------------------------
   Security: XSS-sicheres Rendern
   - kein innerHTML mit User-Eingaben
   - nur createElement + textContent
---------------------------- */
function renderTable(rows) {
  // sicher leeren
  tableBody.textContent = "";

  for (const r of rows) {
    const tr = document.createElement("tr");

    const tdLand = document.createElement("td");
    tdLand.textContent = r.land;

    const tdUnt = document.createElement("td");
    tdUnt.textContent = r.unternehmen;

    const tdCo2 = document.createElement("td");
    tdCo2.className = "text-end";
    tdCo2.textContent = r.co2.toFixed(1);

    const tdJahr = document.createElement("td");
    tdJahr.textContent = String(r.jahr);

    tr.append(tdLand, tdUnt, tdCo2, tdJahr);
    tableBody.appendChild(tr);
  }

  resultCount.textContent = `${rows.length} Ergebnisse`;
}

function uniqueCountries() {
  const set = new Set(DATA.map(d => d.land));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "de"));
}

function fillCountrySelect() {
  for (const country of uniqueCountries()) {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    filterCountry.appendChild(opt);
  }
}

function normalizeQuery(input) {
  // Minimale Absicherung: Länge + Trim, nur als Text weiterverarbeiten
  // (XSS verhindern wir zusätzlich durch textContent beim Rendern)
  return String(input).trim().slice(0, 50).toLowerCase();
}

function sortRows(rows, key, ascending) {
  const dir = ascending ? 1 : -1;

  rows.sort((a, b) => {
    if (key === "co2") return (a.co2 - b.co2) * dir;
    if (key === "jahr") return (a.jahr - b.jahr) * dir;
    return String(a[key]).localeCompare(String(b[key]), "de") * dir;
  });

  return rows;
}

function applyFilters() {
  const q = normalizeQuery(searchCompany.value);
  const selectedCountry = filterCountry.value;
  const sortKey = sortBy.value;

  let rows = DATA.slice();

  if (selectedCountry) {
    rows = rows.filter(r => r.land === selectedCountry);
  }

  if (q) {
    rows = rows.filter(r => r.unternehmen.toLowerCase().includes(q));
  }

  rows = sortRows(rows, sortKey, sortAscending);
  renderTable(rows);
}

/* ---------------------------
   Events
---------------------------- */
dirToggle.addEventListener("change", () => applyDir(dirToggle.checked));

searchCompany.addEventListener("input", applyFilters);
filterCountry.addEventListener("change", applyFilters);
sortBy.addEventListener("change", applyFilters);

toggleSortDir.addEventListener("click", () => {
  sortAscending = !sortAscending;
  toggleSortDir.textContent = sortAscending ? "Aufsteigend ↑" : "Absteigend ↓";
  applyFilters();
});

resetBtn.addEventListener("click", () => {
  searchCompany.value = "";
  filterCountry.value = "";
  sortBy.value = "land";
  sortAscending = true;
  toggleSortDir.textContent = "Aufsteigend ↑";
  applyFilters();
});

/* ---------------------------
   Init
---------------------------- */
applyDir(false);
fillCountrySelect();
applyFilters();
