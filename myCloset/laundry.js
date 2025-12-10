function getWornOutfits() {
  return JSON.parse(localStorage.getItem("wornOutfits")) || {};
}

function setWornOutfits(map) {
  localStorage.setItem("wornOutfits", JSON.stringify(map));
}

function buildWornItems() {
  const wornOutfits = getWornOutfits();
  const itemsMap = new Map();

  Object.values(wornOutfits).forEach((outfit) => {
    if (outfit.tops) {
      itemsMap.set(outfit.tops, { file: outfit.tops, category: "tops" });
    }
    if (outfit.bottoms) {
      itemsMap.set(outfit.bottoms, { file: outfit.bottoms, category: "bottoms" });
    }
  });

  return Array.from(itemsMap.values());
}

function renderLaundry() {
  const grid = document.getElementById("laundryGrid");
  const emptyState = document.getElementById("emptyState");
  const items = buildWornItems();

  grid.innerHTML = "";

  if (items.length === 0) {
    grid.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  grid.style.display = "grid";
  emptyState.style.display = "none";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "laundry-card";

    const img = document.createElement("img");
    img.src = `./assets/${item.category}/${item.file}`;
    img.alt = item.file;

    card.appendChild(img);
    grid.appendChild(card);
  });
}

function takeOut(file, category) {
  const wornOutfits = getWornOutfits();
  let changed = false;

  Object.keys(wornOutfits).forEach((date) => {
    if (wornOutfits[date][category] === file) {
      delete wornOutfits[date][category];
      changed = true;
    }

    if (!wornOutfits[date].tops && !wornOutfits[date].bottoms) {
      delete wornOutfits[date];
      changed = true;
    }
  });

  if (changed) {
    setWornOutfits(wornOutfits);
    renderLaundry();
  }
}

function doLaundry() {
  const wornOutfits = getWornOutfits();
  const datesToClear = Object.keys(wornOutfits);
  
  // Clear worn outfits
  setWornOutfits({});
  
  // Remove saved outfits for dates that had worn items
  if (datesToClear.length > 0) {
    const savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || [];
    const filteredOutfits = savedOutfits.filter((outfit) => !datesToClear.includes(outfit.date));
    localStorage.setItem("savedOutfits", JSON.stringify(filteredOutfits));
  }
  
  // Play laundry sound
  const laundrySound = new Audio("./assets/closet/bubble-254777.mp3");
  laundrySound.play();
  
  renderLaundry();
}

document.addEventListener("DOMContentLoaded", () => {
  const doLaundryBtn = document.getElementById("doLaundryBtn");
  doLaundryBtn.addEventListener("click", doLaundry);
  renderLaundry();
});
