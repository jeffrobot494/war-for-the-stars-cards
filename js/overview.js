async function loadRules() {
  try {
    // Updated path: basic_rules.txt is now in the txt folder.
    const response = await fetch("../txt/basic_rules.txt");
    const text = await response.text();
    const lines = text.split("\n");
    let content = "";
    let imageGroup = [];

    lines.forEach(line => {
      line = line.trim();
      // Special case: if we see the marker, insert a placeholder.
      if (line === "[introduction canvas]") {
        if (imageGroup.length > 0) {
          content += `<div class="image-row">${imageGroup.join("")}</div>`;
          imageGroup = [];
        }
        // Insert a placeholder div with a known id.
        content += `<div id="introduction-canvas-placeholder"></div>`;
      } else if (/^\d+\.\s/.test(line)) {
        if (imageGroup.length > 0) {
          content += `<div class="image-row">${imageGroup.join("")}</div>`;
          imageGroup = [];
        }
        content += `<h2>${line}</h2>`;
      } else if (line.startsWith("[") && (line.endsWith("]") || line.endsWith("]+"))) {
        // Check if the image reference ends with a "+".
        let hasPlus = false;
        if (line.endsWith("]+")) {
          hasPlus = true;
          // Remove the trailing plus.
          line = line.replace(/\]\+$/, "]");
        }
        let imgData = line.slice(1, -1).split(",");
        let imgSrc = imgData[0].trim();
        let scaleMultiplier = imgData.length > 1 ? parseFloat(imgData[1].trim()) : 1;
        let imgStyle = `max-width: ${100 * scaleMultiplier}%;`;
        let imgTag = `<img src="${imgSrc}" style="${imgStyle}">`;
        imageGroup.push(imgTag);
        // If this image does NOT end with a plus, flush the image group immediately.
        if (!hasPlus) {
          content += `<div class="image-row">${imageGroup.join("")}</div>`;
          imageGroup = [];
        }
      } else {
        if (imageGroup.length > 0) {
          content += `<div class="image-row">${imageGroup.join("")}</div>`;
          imageGroup = [];
        }
        content += `<p>${line}</p>`;
      }
    });

    if (imageGroup.length > 0) {
      content += `<div class="image-row">${imageGroup.join("")}</div>`;
    }

    document.getElementById("rules-content").innerHTML = content;

    // Now, find the placeholder and insert the canvas container into it.
    const placeholder = document.getElementById("introduction-canvas-placeholder");
    if (placeholder) {
      placeholder.innerHTML = `<div id="introduction-canvas-container">
                                  <canvas id="introductionCanvas" width="600" height="400"></canvas>
                               </div>`;
      initIntroductionHTML();
    }
  } catch (error) {
    console.error("Error loading rules:", error);
  }
}

window.onload = loadRules;

function initIntroductionHTML() {
  // Get the placeholder element (inserted via loadRules)
  const container = document.getElementById("introduction-canvas-placeholder");
  if (!container) return;

  // Create the main container for the introduction element.
  const introDiv = document.createElement("div");
  introDiv.id = "introduction-container";
  // Set the container size and background.
  introDiv.style.position = "relative";
  introDiv.style.width = "1200px";
  introDiv.style.height = "800px";
  introDiv.style.backgroundImage = 'url("../maps/map.jpg")';
  introDiv.style.backgroundSize = "cover";
  introDiv.style.backgroundPosition = "center";
  
  // --- Construction Areas ---
  // Each construction area is an absolutely positioned div.
  const constructionData = [
    { label: "P1", left: 100, top: 100, width: 320, height: 200, borderColor: "#ff9999" },
    { label: "P2", left: 775, top: 100, width: 320, height: 200, borderColor: "#99ccff" },
    { label: "P3", left: 100, top: 500, width: 320, height: 200, borderColor: "#ffff99" },
    { label: "P4", left: 775, top: 500, width: 320, height: 200, borderColor: "#99ff99" }
  ];
  
  constructionData.forEach(area => {
    const div = document.createElement("div");
    div.className = "construction-area";
    div.style.position = "absolute";
    div.style.left = area.left + "px";
    div.style.top = area.top + "px";
    div.style.width = area.width + "px";
    div.style.height = area.height + "px";
    div.style.backgroundColor = "rgba(50,50,50,0.3)";
    div.style.border = "3px solid " + area.borderColor;
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.transition = "transform 0.3s";
    div.innerText = area.label;
    // Add hover effect.
    div.addEventListener("mouseover", () => {
      div.style.transform = "scale(1.1)";
    });
    div.addEventListener("mouseout", () => {
      div.style.transform = "scale(1)";
    });
    introDiv.appendChild(div);
  });
  
  // --- Zone Cards ---
  // Create a container for the zone cards.
  const zoneCardsContainer = document.createElement("div");
  zoneCardsContainer.id = "zone-cards-container";
  zoneCardsContainer.style.position = "absolute";
  // Calculate container dimensions: 5 cards each 40px wide with 20px gaps.
  const zoneContainerWidth = 5 * 40 + 4 * 20; // 280px
  zoneCardsContainer.style.width = zoneContainerWidth + "px";
  zoneCardsContainer.style.height = "58px"; // card height
  // Center the container.
  zoneCardsContainer.style.left = ((1200 - zoneContainerWidth) / 2) + "px";
  zoneCardsContainer.style.top = ((800 - 58) / 2) + "px";
  zoneCardsContainer.style.display = "flex";
  zoneCardsContainer.style.justifyContent = "space-between";
  introDiv.appendChild(zoneCardsContainer);
  
  // Append the introduction container to the placeholder.
  container.appendChild(introDiv);
  
  // --- Load Zone Card Images ---
// --- Load Zone Card Images ---
fetch("../cards.json")
  .then(response => response.json())
  .then(data => {
    let objectiveCards = data.filter(name => name.startsWith("objective_"));
    // Shuffle the list.
    for (let i = objectiveCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [objectiveCards[i], objectiveCards[j]] = [objectiveCards[j], objectiveCards[i]];
    }
    objectiveCards = objectiveCards.slice(0, 5);
    // For each objective card, create a flip card element.
    objectiveCards.forEach(cardName => {
      // Create the outer flip card container.
      const flipCard = document.createElement("div");
      flipCard.className = "flip-card";
      flipCard.style.width = "40px";
      flipCard.style.height = "58px";
      flipCard.style.perspective = "600px";

      // Create the inner container that will actually flip.
      const flipCardInner = document.createElement("div");
      flipCardInner.className = "flip-card-inner";
      flipCardInner.style.position = "relative";
      flipCardInner.style.width = "100%";
      flipCardInner.style.height = "100%";
      flipCardInner.style.transition = "transform 0.6s ease";
      flipCardInner.style.transformStyle = "preserve-3d";

      // Create the front face with the card image.
      const flipCardFront = document.createElement("div");
      flipCardFront.className = "flip-card-front";
      flipCardFront.style.position = "absolute";
      flipCardFront.style.width = "100%";
      flipCardFront.style.height = "100%";
      flipCardFront.style.backfaceVisibility = "hidden";
      const img = document.createElement("img");
      img.src = "../cards/" + cardName;
      img.style.width = "100%";
      img.style.height = "100%";
      flipCardFront.appendChild(img);

      // Create the back face (a simple black side).
      const flipCardBack = document.createElement("div");
      flipCardBack.className = "flip-card-back";
      flipCardBack.style.position = "absolute";
      flipCardBack.style.width = "100%";
      flipCardBack.style.height = "100%";
      flipCardBack.style.backfaceVisibility = "hidden";
      flipCardBack.style.backgroundColor = "black";
      flipCardBack.style.transform = "rotateY(180deg)";

      // Assemble the flip card.
      flipCardInner.appendChild(flipCardFront);
      flipCardInner.appendChild(flipCardBack);
      flipCard.appendChild(flipCardInner);

      // Add mouseover/mouseout handlers for the flip animation and slight scaling.
      flipCard.addEventListener("mouseover", () => {
        flipCardInner.style.transform = "rotateY(180deg) scale(1.1)";
      });
      flipCard.addEventListener("mouseout", () => {
        flipCardInner.style.transform = "rotateY(0deg) scale(1)";
      });

      // Append this flip card to your zone cards container.
      zoneCardsContainer.appendChild(flipCard);
    });
  })
  .catch(err => console.error("Error fetching cards.json:", err));

}

// Insert CSS for the flip animation and any additional styling.
(function addFlipAnimationCSS() {
  const css = `
  @keyframes flip {
    0% { transform: perspective(600px) rotateY(0deg); }
    50% { transform: perspective(600px) rotateY(90deg); }
    100% { transform: perspective(600px) rotateY(0deg); }
  }
  .flip-animation {
    animation: flip 1s forwards;
  }
  /* Optional: Ensure the introduction container remains centered */
  #introduction-container {
    margin: 0 auto;
  }
  `;
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
})();

// Call this function after your rules are loaded.
// For example, in your loadRules() function, replace the canvas insertion with:
function replaceIntroductionCanvas() {
  const placeholder = document.getElementById("introduction-canvas-placeholder");
  if (placeholder) {
    // Clear the placeholder and initialize our HTML version.
    placeholder.innerHTML = "";
    initIntroductionHTML();
  }
}

// In loadRules(), after setting innerHTML, add:
window.onload = function() {
  loadRules().then(() => {
    replaceIntroductionCanvas();
  });
};
