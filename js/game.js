/**
 * Make sure that numbers.js file is loaded before this file
 */
// Create the elements for the game
let messagePane = createPane(MESSAGE_PANE_ID);
let statusPane = createPane(STATUS_PANE_ID);
let navigationButton = createNavigationButton();
let errorPane = createPane(ERROR_PANE_ID);

// Create the backend board and frontend grid
let board = createBoard();
let grid = createGrid(board);

// Initialize the elements with text content
navigationButton.innerText = 'Next Round';
displayMessage(messagePane, "Add blocks on board by pressing b after selecting a cell");
updateStatus(statusPane, board);
displayError(errorPane, "Errors will be displayed here");

// Adding event listeners to all the front end grid cells
let gridCells = grid.querySelectorAll('td');
for (let i = 0; i < gridCells.length; ++i) {
   let cell = gridCells[i];
   cell.addEventListener('click', function () {
      // If there's already an active cell, deselect it first
      if (elementWithIDExists(ACTIVE_CELL_ID)) {
         let element = document.getElementById(ACTIVE_CELL_ID);
         element.removeAttribute('id');
         // If it's not this cell which was active, then activate it
         if (element !== cell) {
            cell.id = ACTIVE_CELL_ID;
         }
      }
      // Else add the active id
      else {
         cell.id = ACTIVE_CELL_ID;
      }
   });
}

// Event listener for button
navigationButton.addEventListener('click', function () {
   updateNavigationButton(board, grid, statusPane, messagePane, errorPane, navigationButton);
});

// Adding event listener for keydown
document.addEventListener('keydown', function (e) {
   // Update the front end and status
   updateFrontend(grid, board);
   updateStatus(statusPane, board);
   // Get the element that is active
   let active = document.getElementById(ACTIVE_CELL_ID);
   // If no element is active
   if (active === null) {
      displayError(errorPane, 'Please select a cell!');
   }
   // Else if an element is active
   else {
      // Extract its coordinates as well as the key that's pressed
      let row = getCellRowIndex(active);
      let column = getCellColIndex(active);
      let key = e.key.toLowerCase();
      // Perform appropriate operation depending upon the stage
      if (stage === SETUP) {
         setup(board, row, column, messagePane, statusPane, errorPane, navigationButton, key);
      } else if (stage === PLAY) {
         play(board, grid, row, column, messagePane, errorPane, statusPane, navigationButton, key);
      } else if (stage === END) {
         displayError(errorPane, "Game has ended! Press Restart button to start the game again");
      }
      // Deselect the active element
      active.removeAttribute('id');
   }
   // Update the frontend and status
   updateFrontend(grid, board);
   updateStatus(statusPane, board);
});

