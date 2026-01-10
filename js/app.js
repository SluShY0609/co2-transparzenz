"use strict";

const btn = document.getElementById("testBtn");
const out = document.getElementById("out");

btn.addEventListener("click", () => {
  out.textContent = "Button funktioniert ✅";
});
