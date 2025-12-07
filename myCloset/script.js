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

// Track current index for each category
const categoryIndices = {};

// Function to create a clothing item element
function createClothingItem(category, item) {
  const clothingItem = document.createElement("div");
  clothingItem.className = "clothing-item";

  const img = document.createElement("img");
  img.src = `/myCloset/assets/${category}/${item.file}`;
  img.alt = item.name;

  clothingItem.appendChild(img);
  return clothingItem;
}

// Function to get next items in a circular fashion
function getNextItems(category, count) {
  const items = clothingData[category];
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const index = categoryIndices[category] % items.length;
    result.push(items[index]);
    categoryIndices[category]++;
  }
  
  return result;
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

    // Right arrow button
    const rightBtn = document.createElement("button");
    rightBtn.className = "nav-btn right-btn";
    rightBtn.innerHTML = "→";
    rightBtn.setAttribute("aria-label", "Scroll right");

    // Add initial 5 items
    const initialItems = getNextItems(category, 5);
    initialItems.forEach((item) => {
      const clothingItem = createClothingItem(category, item);
      scroller.appendChild(clothingItem);
    });

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

// Function to enable infinite scrolling with navigation buttons
function setupInfiniteScroll() {
  const scrollers = document.querySelectorAll(".media-scroller");

  scrollers.forEach((scroller) => {
    const category = scroller.dataset.category;
    const shelf = scroller.closest(".shelf");
    const leftBtn = shelf.querySelector(".left-btn");
    const rightBtn = shelf.querySelector(".right-btn");
    let isScrolling = false;

    // Handle left button click
    leftBtn.addEventListener("click", () => {
      const scrollAmount = scroller.clientWidth * 0.8; // Scroll 80% of visible width
      scroller.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    // Handle right button click
    rightBtn.addEventListener("click", () => {
      const scrollAmount = scroller.clientWidth * 0.8; // Scroll 80% of visible width
      scroller.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });

    // Handle scroll event to add more items
    scroller.addEventListener("scroll", () => {
      if (isScrolling) return;
      
      const scrollLeft = scroller.scrollLeft;
      const scrollWidth = scroller.scrollWidth;
      const clientWidth = scroller.clientWidth;
      
      // Check if we're near the end (within 200px)
      if (scrollLeft + clientWidth >= scrollWidth - 200) {
        isScrolling = true;
        
        // Add next item
        const nextItems = getNextItems(category, 1);
        nextItems.forEach((item) => {
          const clothingItem = createClothingItem(category, item);
          scroller.appendChild(clothingItem);
        });
        
        // Small delay before allowing next append
        setTimeout(() => {
          isScrolling = false;
        }, 100);
      }
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