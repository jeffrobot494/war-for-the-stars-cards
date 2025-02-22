// shipbuilder.js

let currentDraggedElement = null;

async function loadModuleCards() {
  try {
    const response = await fetch("../cards.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const cards = await response.json();
    const modulesList = document.getElementById("modules-list");
    // Filter for filenames that start with "module_"
    const moduleCards = cards.filter(card => card.startsWith("module_"));
    moduleCards.forEach(filename => {
      const img = document.createElement("img");
      img.src = "../cards/" + filename;
      img.alt = filename;
      img.className = "module-card";
      img.draggable = true;
      // For sidebar, when dragging, we want to clone the card
      img.addEventListener("dragstart", function(e) {
        e.dataTransfer.setData("text/plain", filename);
        currentDraggedElement = this;
        this.dataset.source = "sidebar";
      });
      modulesList.appendChild(img);
    });
  } catch (error) {
    console.error("Error loading module cards:", error);
  }
}

function initGrid() {
  const gridContainer = document.getElementById("grid-container");
  // Create a 14x6 grid (84 cells)
  for (let i = 0; i < 84; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    
    // Allow dragover
    cell.addEventListener("dragover", function(e) {
      e.preventDefault();
    });
    
	cell.addEventListener("drop", function(e) {
	  e.preventDefault();
	  const filename = e.dataTransfer.getData("text/plain");
	  let finalElement;
	  if (currentDraggedElement) {
		if (currentDraggedElement.dataset.source === "grid") {
		  finalElement = currentDraggedElement;
		  if (finalElement.parentElement) {
			finalElement.parentElement.removeChild(finalElement);
		  }
		} else {
		  finalElement = currentDraggedElement.cloneNode(true);
		  finalElement.dataset.source = "grid";
		  finalElement.addEventListener("dragstart", function(e) {
			e.dataTransfer.setData("text/plain", filename);
			currentDraggedElement = this;
		  });
		}
	  } else {
		finalElement = document.createElement("img");
		finalElement.src = "../cards/" + filename;
		finalElement.alt = filename;
		finalElement.className = "dropped-module";
		finalElement.draggable = true;
		finalElement.addEventListener("dragstart", function(e) {
		  e.dataTransfer.setData("text/plain", filename);
		  currentDraggedElement = this;
		  this.dataset.source = "grid";
		});
	  }
	  
	  // Ensure the dropped element fills the cell
	  finalElement.className = "dropped-module";
	  
	  // Add click listener to toggle expansion
	  finalElement.addEventListener("click", function(e) {
		// Prevent the click event from triggering the cell's contextmenu or other events
		e.stopPropagation();
		this.classList.toggle("expanded");
	  });
	  
	  let contentDiv = cell.querySelector(".cell-content");
	  if (!contentDiv) {
		contentDiv = document.createElement("div");
		contentDiv.className = "cell-content";
		cell.appendChild(contentDiv);
	  }
	  // Optionally, allow only one card per cell:
	  contentDiv.innerHTML = "";
	  contentDiv.appendChild(finalElement);
	  
	  currentDraggedElement = null;
	});
    
    // Right-click to remove a module from the cell.
    cell.addEventListener("contextmenu", function(e) {
      e.preventDefault();
      let contentDiv = cell.querySelector(".cell-content");
      if (contentDiv) {
        contentDiv.innerHTML = "";
      }
    });
    
    gridContainer.appendChild(cell);
  }
}

window.onload = function() {
  loadModuleCards();
  initGrid();
};
