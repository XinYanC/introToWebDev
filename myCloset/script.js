var leftDoor = document.querySelector(".door-left");
var rightDoor = document.querySelector(".door-right");
var closetContainer = document.querySelector(".closet");
var doorSound = document.getElementById("doorSound");
var shelvesContainer = document.getElementById("shelves");

// Clothing data organized by category
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

// Track current center index for each category
const categoryIndices = {};

// Function to create a clothing item element
function createClothingItem(category, item, isCenter = false) {
  const clothingItem = document.createElement("div");
  clothingItem.className = "clothing-item";

  if (isCenter) {
    clothingItem.classList.add("is-center");
  }

  const img = document.createElement("img");
  img.src = `/myCloset/assets/${category}/${item.file}`;
  img.alt = item.name;

  clothingItem.appendChild(img);
  return clothingItem;
}

// Render a fixed window of items centered on the current index
function renderWindow(category, scroller, direction = "none") {
  const items = clothingData[category];
  const total = items.length;
  const centerIndex = categoryIndices[category];
  const windowSize = 5; // keep odd so there is a center
  const half = Math.floor(windowSize / 2);

  scroller.innerHTML = "";

  for (let offset = -half; offset <= half; offset++) {
    const itemIndex = (centerIndex + offset + total) % total;
    const item = items[itemIndex];
    const isCenter = offset === 0;
    const clothingItem = createClothingItem(category, item, isCenter);
    scroller.appendChild(clothingItem);
  }

  // Trigger slide animation based on direction
  if (direction !== "none") {
    const animClass = direction === "forward" ? "slide-left" : "slide-right";
    scroller.classList.remove("slide-left", "slide-right");
    // force reflow to restart animation
    void scroller.offsetWidth;
    scroller.classList.add(animClass);
  }
}

// Function to create shelves dynamically
function createShelves() {
  shelvesContainer.innerHTML = "";

  Object.keys(clothingData).forEach((category) => {
    // Initialize index for this category
    categoryIndices[category] = 0;
    
    const shelf = document.createElement("div");
    shelf.className = "shelf";

    // Create navigation container
    const navContainer = document.createElement("div");
    navContainer.className = "shelf-nav";

    // Left arrow button
    const leftBtn = document.createElement("button");
    leftBtn.className = "nav-btn left-btn";
    leftBtn.innerHTML = "←";
    leftBtn.setAttribute("aria-label", "Scroll left");

    // Scroller container
    const scroller = document.createElement("div");
    scroller.className = "media-scroller snaps-inline";
    scroller.dataset.category = category;
    
    // Set z-index based on category
    const zIndexMap = { tops: 30, bottoms: 20, shoes: 10 };
    scroller.style.zIndex = zIndexMap[category] || 10;

    // Right arrow button
    const rightBtn = document.createElement("button");
    rightBtn.className = "nav-btn right-btn";
    rightBtn.innerHTML = "→";
    rightBtn.setAttribute("aria-label", "Scroll right");

    // Add initial window
    renderWindow(category, scroller);

    // Assemble the shelf
    navContainer.appendChild(leftBtn);
    navContainer.appendChild(scroller);
    navContainer.appendChild(rightBtn);
    shelf.appendChild(navContainer);
    shelvesContainer.appendChild(shelf);
  });

  // Add scroll support after shelves are created
  setupInfiniteScroll();
}

// Button-controlled navigation over a fixed window; no manual scrolling
function setupInfiniteScroll() {
  const scrollers = document.querySelectorAll(".media-scroller");

  scrollers.forEach((scroller) => {
    const category = scroller.dataset.category;
    const shelf = scroller.closest(".shelf");
    const leftBtn = shelf.querySelector(".left-btn");
    const rightBtn = shelf.querySelector(".right-btn");
    // Handle left button click (move backward one, re-render)
    leftBtn.addEventListener("click", () => {
      const items = clothingData[category];
      categoryIndices[category] = (categoryIndices[category] - 1 + items.length) % items.length;
      renderWindow(category, scroller, "backward");
    });

    // Handle right button click (move forward one, re-render)
    rightBtn.addEventListener("click", () => {
      const items = clothingData[category];
      categoryIndices[category] = (categoryIndices[category] + 1) % items.length;
      renderWindow(category, scroller, "forward");
    });
  });
}

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