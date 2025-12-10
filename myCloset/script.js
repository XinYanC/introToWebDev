var leftDoor = document.querySelector(".door-left");
var rightDoor = document.querySelector(".door-right");
var closetContainer = document.querySelector(".closet");
var doorSound = document.getElementById("doorSound");
var shelvesContainer = document.getElementById("shelves");
var saveOutfitBtn = document.getElementById("saveOutfitBtn");
var outfitModal = document.getElementById("outfitModal");
var closeModalBtn = document.querySelector(".close");
var confirmSaveBtn = document.getElementById("confirmSaveBtn");
var outfitDateInput = document.getElementById("outfitDate");
var outfitPreviewContainer = document.getElementById("outfitPreview");
var viewOutfitsBtn = document.getElementById("viewOutfitsBtn");

// Today's date as default for save button
outfitDateInput.valueAsDate = new Date();

// Keep doors open if coming from saved outfits page
if (sessionStorage.getItem("doorsOpen") === "true") {
  closetContainer.classList.add("doors-open");
  sessionStorage.removeItem("doorsOpen");
}

// Clothing data
const clothingData = {
  tops: [
    { name: "Cardigan", file: "cardigan1.PNG" },
    { name: "Hoodie", file: "hoodie1.PNG" },
    { name: "Shirt", file: "shirt1.PNG" },
    { name: "Shirt", file: "shirt2.PNG" },
    { name: "Sweater", file: "sweater1.png" },
    { name: "Sweater", file: "sweater2.PNG" },
    { name: "Sweater", file: "sweater3.PNG" },
    { name: "Sweater", file: "sweater4.PNG" },
    { name: "Sweater", file: "sweater5.PNG" },
    { name: "Sweater", file: "sweater6.PNG" },
    { name: "Sweater", file: "sweater7.PNG" },
    { name: "Sweatshirt", file: "sweatshirt1.PNG" },
    { name: "Turtleneck", file: "turtleneck1.PNG" },
    { name: "Turtleneck", file: "turtleneck2.PNG" },
  ],
  bottoms: [
    { name: "Jeans", file: "jeans1.PNG" },
    { name: "Jeans", file: "jeans2.PNG" },
    { name: "Jeans", file: "jeans3.PNG" },
    { name: "Shorts", file: "shorts1.PNG" },
    { name: "Skirt", file: "skirt1.PNG" },
    { name: "Sweats", file: "sweats1.PNG" },
    { name: "Sweats", file: "sweats2.PNG" },
  ],
  shoes: [
    { name: "Boot", file: "boot1.PNG" },
    { name: "Boot", file: "boot2.PNG" },
    { name: "Loafer", file: "loafer1.PNG" },
    { name: "Mary Jane", file: "maryjane1.PNG" },
    { name: "Mary Jane", file: "maryjane2.PNG" },
    { name: "Sneaker", file: "sneaker1.PNG" },
  ],
};

// Visible clothing after removing worn items
let visibleClothingData = {};

function getWornItems() {
  const wornOutfits = JSON.parse(localStorage.getItem("wornOutfits")) || {};
  const wornTops = new Set();
  const wornBottoms = new Set();

  Object.values(wornOutfits).forEach((outfit) => {
    if (outfit.tops) wornTops.add(outfit.tops);
    if (outfit.bottoms) wornBottoms.add(outfit.bottoms);
  });

  return { wornTops, wornBottoms };
}

function buildVisibleClothing() {
  const { wornTops, wornBottoms } = getWornItems();

  visibleClothingData = {
    tops: clothingData.tops.filter((item) => !wornTops.has(item.file)),
    bottoms: clothingData.bottoms.filter((item) => !wornBottoms.has(item.file)),
    shoes: clothingData.shoes,
  };
}

// Track current center index and outfits
const categoryIndices = {};
let currentOutfit = { tops: null, bottoms: null, shoes: null };


function createClothingItem(category, item, isCenter = false) {
  const clothingItem = document.createElement("div");
  clothingItem.className = "clothing-item";

  if (isCenter) {
    clothingItem.classList.add("is-center");
  }

  const img = document.createElement("img");
  img.src = `./assets/${category}/${item.file}`;
  img.alt = item.name;

  clothingItem.appendChild(img);
  return clothingItem;
}

function renderWindow(category, scroller, direction = "none") {
  const items = visibleClothingData[category] || [];
  const total = items.length;
  const centerIndex = categoryIndices[category];
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);

  scroller.innerHTML = "";

  if (total === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "empty-shelf";
    emptyMsg.textContent = "Nothing here (worn)";
    scroller.appendChild(emptyMsg);
    return;
  }

  for (let offset = -half; offset <= half; offset++) {
    const itemIndex = (centerIndex + offset + total) % total;
    const item = items[itemIndex];
    const isCenter = offset === 0;
    const clothingItem = createClothingItem(category, item, isCenter);
    scroller.appendChild(clothingItem);
  }

  // Trigger slide animation from left/right button slide
  if (direction !== "none") {
    const animClass = direction === "forward" ? "slide-left" : "slide-right";
    scroller.classList.remove("slide-left", "slide-right");
    void scroller.offsetWidth;
    scroller.classList.add(animClass);
  }
}

// Create each shelves
function createShelves() {
  shelvesContainer.innerHTML = "";

  buildVisibleClothing();

  Object.keys(clothingData).forEach((category) => {
    const items = visibleClothingData[category] || [];
    categoryIndices[category] = items.length ? 0 : -1;
    
    const shelf = document.createElement("div");
    shelf.className = "shelf";

    const navContainer = document.createElement("div");
    navContainer.className = "shelf-nav";

    // Left arrow button
    const leftBtn = document.createElement("button");
    leftBtn.className = "nav-btn left-btn";
    leftBtn.innerHTML = "←";
    leftBtn.setAttribute("aria-label", "Scroll left");

    // Right arrow button
    const rightBtn = document.createElement("button");
    rightBtn.className = "nav-btn right-btn";
    rightBtn.innerHTML = "→";
    rightBtn.setAttribute("aria-label", "Scroll right");

    // horizontal container
    const scroller = document.createElement("div");
    scroller.className = "media-scroller snaps-inline";
    scroller.dataset.category = category;

    const zIndexMap = { tops: 30, bottoms: 20, shoes: 10 };
    scroller.style.zIndex = zIndexMap[category] || 10;

    renderWindow(category, scroller);
    
    updateCurrentOutfit(category);

    navContainer.appendChild(leftBtn);
    navContainer.appendChild(scroller);
    navContainer.appendChild(rightBtn);
    shelf.appendChild(navContainer);
    shelvesContainer.appendChild(shelf);
  });

  // Add scroll functionality
  setupInfiniteScroll();
}

// Button-controlled scrolling
function setupInfiniteScroll() {
  const scrollers = document.querySelectorAll(".media-scroller");

  scrollers.forEach((scroller) => {
    const category = scroller.dataset.category;
    const shelf = scroller.closest(".shelf");
    const leftBtn = shelf.querySelector(".left-btn");
    const rightBtn = shelf.querySelector(".right-btn");
    
    // Left button click (move backward one, re-render)
    leftBtn.addEventListener("click", () => {
      const items = visibleClothingData[category] || [];
      if (!items.length) return;
      categoryIndices[category] = (categoryIndices[category] - 1 + items.length) % items.length;
      renderWindow(category, scroller, "backward");
      updateCurrentOutfit(category);
    });

    // Right button click (move forward one, re-render)
    rightBtn.addEventListener("click", () => {
      const items = visibleClothingData[category] || [];
      if (!items.length) return;
      categoryIndices[category] = (categoryIndices[category] + 1) % items.length;
      renderWindow(category, scroller, "forward");
      updateCurrentOutfit(category);
    });
  });
}

// Update current outfit based on center items
function updateCurrentOutfit(category) {
  const items = visibleClothingData[category] || [];
  const centerIndex = categoryIndices[category];

  if (!items.length || centerIndex < 0) {
    currentOutfit[category] = null;
  } else {
    currentOutfit[category] = {
      index: centerIndex,
      item: items[centerIndex],
    };
  }
  
  // Enable save button only if all three categories have items
  if (currentOutfit.tops && currentOutfit.bottoms && currentOutfit.shoes) {
    saveOutfitBtn.style.display = "block";
  } else {
    saveOutfitBtn.style.display = "none";
  }
}

// Open save outfit modal
saveOutfitBtn.addEventListener("click", () => {
  outfitPreviewContainer.innerHTML = "";
  
  ["tops", "bottoms", "shoes"].forEach((category) => {
    const outfitItem = document.createElement("div");
    outfitItem.className = "outfit-preview-item";
    
    const img = document.createElement("img");
    img.src = `./assets/${category}/${currentOutfit[category].item.file}`;
    img.alt = currentOutfit[category].item.name;
    
    outfitItem.appendChild(img);
    outfitPreviewContainer.appendChild(outfitItem);
  });
  
  outfitModal.classList.add("show");
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  outfitModal.classList.remove("show");
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === outfitModal) {
    outfitModal.classList.remove("show");
  }
});

// Save outfit to localStorage: https://www.w3schools.com/html/html5_webstorage.asp
confirmSaveBtn.addEventListener("click", () => {
  const date = outfitDateInput.value;
  
  if (!date) {
    alert("Please select a date");
    return;
  }
  
  // Get existing outfits from localStorage or else empty
  let savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || [];
  
  // Create outfit object
  const outfit = {
    date: date,
    tops: currentOutfit.tops.item.file,
    bottoms: currentOutfit.bottoms.item.file,
    shoes: currentOutfit.shoes.item.file,
    saved: new Date().toISOString()
  };
  
  // Save outfits
  savedOutfits.push(outfit);
  localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits));
  
  // Close modal and reset
  outfitModal.classList.remove("show");
  outfitDateInput.valueAsDate = new Date();
});

// View saved outfits button
viewOutfitsBtn.addEventListener("click", () => {
  const savedOutfitsPage = `${window.location.pathname.replace('index.html', '')}saved-outfits.html`;
  window.location.href = savedOutfitsPage;
});

// Door functionality
leftDoor.addEventListener("click", toggleDoors);
rightDoor.addEventListener("click", toggleDoors);

function toggleDoors() {
  closetContainer.classList.toggle("doors-open");
  doorSound.currentTime = 0;
  doorSound.play();
}

// Initialize shelves on page load
createShelves();