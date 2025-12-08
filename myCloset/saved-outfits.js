// Load and display saved outfits
function loadSavedOutfits() {
  const outfitsGrid = document.getElementById("outfitsGrid");
  const emptyState = document.getElementById("emptyState");
  
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
    dateCard.className = "date-card";
    
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
          <button class="delete-btn" data-date="${date}" data-index="${outfitIndex}">Delete</button>
        </div>
      `;
    });
    
    cardHTML += `</div>`;
    dateCard.innerHTML = cardHTML;
    outfitsGrid.appendChild(dateCard);
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

// Delete
function deleteOutfit(date, index) {
  const savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || [];
  const dateOutfits = savedOutfits.filter((o) => o.date === date);
  const outfitToDelete = dateOutfits[index];
  const outfitIndex = savedOutfits.indexOf(outfitToDelete);
  
  savedOutfits.splice(outfitIndex, 1);
  localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits));
  loadSavedOutfits();
}

document.addEventListener("DOMContentLoaded", loadSavedOutfits);
