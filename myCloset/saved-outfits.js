function getWornOutfits() {
  return JSON.parse(localStorage.getItem("wornOutfits")) || {};
}

function setWornOutfits(wornMap) {
  localStorage.setItem("wornOutfits", JSON.stringify(wornMap));
}

function loadSavedOutfits() {
  const outfitsGrid = document.getElementById("outfitsGrid");
  const emptyState = document.getElementById("emptyState");
  const wornOutfits = getWornOutfits();

  const savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || [];
  
  if (savedOutfits.length === 0) {
    outfitsGrid.style.display = "none";
    emptyState.style.display = "block";
    return;
  }
  
  outfitsGrid.innerHTML = "";
  emptyState.style.display = "none";
  
  savedOutfits.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const outfitsByDate = {};
  savedOutfits.forEach((outfit) => {
    if (!outfitsByDate[outfit.date]) {
      outfitsByDate[outfit.date] = [];
    }
    outfitsByDate[outfit.date].push(outfit);
  });
  
  Object.keys(outfitsByDate).sort().reverse().forEach((date) => {
    const dateOutfits = outfitsByDate[date];
    
    const dateCard = document.createElement("div");
    const dateHasWorn = Boolean(wornOutfits[date]);
    dateCard.className = dateHasWorn ? "date-card worn-date" : "date-card";
    
    // Date formatting
    const [year, month, day] = date.split("-");
    const dateObj = new Date(year, month - 1, day);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    
    // Card for saved outfits
    let cardHTML = `<h3>${formattedDate}</h3><div class="outfits-grid-layout">`;
    
    dateOutfits.forEach((outfit, outfitIndex) => {
      const isWorn = Boolean(
        dateHasWorn &&
        wornOutfits[date].tops === outfit.tops &&
        wornOutfits[date].bottoms === outfit.bottoms
      );

      const wearBtnLabel = isWorn ? "Worn" : "Wear";
      const wearBtnDisabled = dateHasWorn ? "disabled" : "";
      const wearBtnClass = isWorn ? "wear-btn worn" : "wear-btn";

      cardHTML += `
        <div class="outfit-column">
          <div class="outfit-item-stacked">
            <img src="./assets/tops/${outfit.tops}" alt="Top" />
          </div>
          <div class="outfit-item-stacked">
            <img src="./assets/bottoms/${outfit.bottoms}" alt="Bottom" />
          </div>
          <div class="outfit-item-stacked">
            <img src="./assets/shoes/${outfit.shoes}" alt="Shoe" />
          </div>
          <button class="${wearBtnClass}" data-date="${date}" data-index="${outfitIndex}" ${wearBtnDisabled}>${wearBtnLabel}</button>
          <button class="delete-btn" data-date="${date}" data-index="${outfitIndex}">Delete</button>
        </div>
      `;
    });
    
    cardHTML += `</div>`;
    dateCard.innerHTML = cardHTML;
    outfitsGrid.appendChild(dateCard);
  });
  
  document.querySelectorAll(".wear-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const date = e.target.dataset.date;
      const index = parseInt(e.target.dataset.index);
      handleWear(date, index);
    });
  });

  // Delete event listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const date = e.target.dataset.date;
      const index = parseInt(e.target.dataset.index);
      deleteOutfit(date, index);
    });
  });
}

function handleWear(date, index) {
  const savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || [];
  const wornOutfits = getWornOutfits();

  if (wornOutfits[date]) {
    return;
  }

  const dateOutfits = savedOutfits.filter((o) => o.date === date);
  const selectedOutfit = dateOutfits[index];

  if (!selectedOutfit) {
    return;
  }

  // Filter rules:
  // - Keep only the worn outfit for its date (remove other outfits that day).
  // - Remove outfits on any other date if they share the same top OR bottom.
  const filteredOutfits = savedOutfits.filter((o) => {
    if (o.date === date) {
      return (
        o.tops === selectedOutfit.tops &&
        o.bottoms === selectedOutfit.bottoms &&
        o.shoes === selectedOutfit.shoes
      );
    }
    const sharesTop = o.tops === selectedOutfit.tops;
    const sharesBottom = o.bottoms === selectedOutfit.bottoms;
    return !(sharesTop || sharesBottom);
  });

  // Clear worn records for dates that now have no outfits left.
  const remainingDates = new Set(filteredOutfits.map((o) => o.date));
  Object.keys(wornOutfits).forEach((d) => {
    if (!remainingDates.has(d)) {
      delete wornOutfits[d];
    }
  });

  // Mark the selected outfit as worn for its date (store top/bottom only).
  wornOutfits[date] = {
    tops: selectedOutfit.tops,
    bottoms: selectedOutfit.bottoms
  };

  localStorage.setItem("savedOutfits", JSON.stringify(filteredOutfits));
  setWornOutfits(wornOutfits);
  loadSavedOutfits();
}

// Delete
function deleteOutfit(date, index) {
  const savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || [];
  const wornOutfits = getWornOutfits();
  const dateOutfits = savedOutfits.filter((o) => o.date === date);
  const outfitToDelete = dateOutfits[index];
  
  if (!outfitToDelete) {
    return;
  }
  
  const outfitIndex = savedOutfits.indexOf(outfitToDelete);
  
  if (outfitIndex === -1) {
    return;
  }
  savedOutfits.splice(outfitIndex, 1);

  const isRemovingWorn = Boolean(
    wornOutfits[date] &&
    wornOutfits[date].tops === outfitToDelete.tops &&
    wornOutfits[date].bottoms === outfitToDelete.bottoms
  );

  const hasRemainingForDate = savedOutfits.some((o) => o.date === date);

  if (isRemovingWorn || !hasRemainingForDate) {
    delete wornOutfits[date];
  }

  localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits));
  setWornOutfits(wornOutfits);
  loadSavedOutfits();
}

document.addEventListener("DOMContentLoaded", loadSavedOutfits);
