"use strict";

// Elemente
const dirToggle = document.getElementById("dirToggle");
const localMenu = document.getElementById("localMenu");
const contentArea = document.getElementById("contentArea");

// Sidebar links/rechts umschalten (ab md-Breite)
function applyDir(isRtl) {
  // Schreibrichtung setzen
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");

  // Reihenfolge (Bootstrap order Klassen) setzen
  localMenu.classList.remove("order-md-1", "order-md-2");
  contentArea.classList.remove("order-md-1", "order-md-2");

  if (isRtl) {
    // Sidebar rechts, Content links
    localMenu.classList.add("order-md-2");
    contentArea.classList.add("order-md-1");
  } else {
    // Sidebar links, Content rechts
    localMenu.classList.add("order-md-1");
    contentArea.classList.add("order-md-2");
  }
}

// Event
dirToggle.addEventListener("change", () => {
  applyDir(dirToggle.checked);
});

// Initial
applyDir(false);
