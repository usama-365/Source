// Board Dimensions
const ROWS = 5, COLUMNS = 5;
// Piece types and their values
const RED = 'red', BLACK = 'black', BLOCK = 'block', EMPTY = 'empty', EMPTY_VALUE = '<br>', BLOCK_VALUE = 'B';
// Player piece and computer piece
const PLAYER_COLOR = RED, COMPUTER_COLOR = BLACK;
// All the stages as constants
const SETUP = 'Setup', PLAY = 'Play', END = 'End';
// Maximum piece limits
const MAX_PLAYER_PIECES_ALLOWED = 8;
const MAX_PIECES_ALLOWED_BY_NUMBER = {
   1: 3, 2: 2, 3: 2, 4: 1
};
// HTML Elements attributes
const PANE_CLASS = 'pane',
   MESSAGE_PANE_ID = 'message',
   STATUS_PANE_ID = 'status',
   ERROR_PANE_ID = 'error',
   NAVIGATION_BUTTON_ID = 'btn',
   GRID_ID = 'grid',
   ACTIVE_CELL_ID = 'active';

// Current stage and round
let stage = SETUP;
let round = 1;

/**
 * Creates a board piece of specified color and value
 * @param colour Color of board piece
 * @param val Value of board piece
 * @returns {{color, value}} board piece object
 */
function createBoardPiece(colour, val) {
   return {
      color: colour,
      value: val
   };
}

/**
 * Creates a 2d array for board of ROWS by COLUMNS dimension. Initializes each element as empty piece
 * @returns {*[]} 2d array representing board
 */
function createBoard() {
   let board = [];
   // For each row and column
   for (let i = 0; i < ROWS; i++) {
      let row = [];
      for (let j = 0; j < COLUMNS; j++) {
         // Push an empty piece in the row
         row.push(createBoardPiece(EMPTY, EMPTY_VALUE));
      }
      board.push(row);
   }
   return board;
}

/**
 * Determines whether the element with that specific ID exists
 * @param id Id of element to check
 * @returns {boolean} true if element exists, else false
 */
function elementWithIDExists(id) {
   return document.getElementById(id) != null;
}

/**
 * Creates grid on the frontend according to the board dimensions and the id of GRID_ID
 * @param board Board containing 2d array of pieces
 * @returns {HTMLElement} Grid created on the frontend
 */
function createGrid(board) {
   // If the grid doesn't exist on front-end, create it
   if (!elementWithIDExists(GRID_ID)) {
      let table = document.createElement('table');
      table.id = GRID_ID;
      document.body.appendChild(table);
   }
   // Remove all the children of grid
   let grid = document.getElementById(GRID_ID);
   grid.innerHTML = '';
   // Add cells inside grid according to board
   for (let i = 0; i < board.length; ++i) {
      let row = document.createElement('tr');
      grid.appendChild(row);
      for (let j = 0; j < board[i].length; ++j) {
         let cell = document.createElement('td');
         row.appendChild(cell);
      }
   }
   return grid;
}

/**
 * Creates a div container of the class PANE_CLASS and the provided id
 * @param id ID of the container
 * @returns {HTMLElement} Div element
 */
function createPane(id) {
   // If the pane doesn't exist, create it according to the provided attributes
   if (!elementWithIDExists(id)) {
      let pane = document.createElement('div');
      pane.classList.add(PANE_CLASS);
      pane.id = id;
      document.body.appendChild(pane);
   }
   return document.getElementById(id);
}

/**
 * Updates the grid (frontend) according to the board (backend)
 * @param grid Front-end grid
 * @param board Back-end board
 */
function updateFrontend(grid, board) {
   // For each board and grid row
   let rows = grid.querySelectorAll('tr');
   for (let i = 0; i < rows.length; ++i) {
      let row = rows[i];
      let cells = row.querySelectorAll('td');
      // For each cell of board and grid
      for (let j = 0; j < cells.length; ++j) {
         let cell = cells[j];
         // Remove any classes from cell, add the piece color as the class and the piece value as inner HTML
         cell.removeAttribute('class');
         cell.classList.add(board[i][j].color);
         cell.innerHTML = board[i][j].value;
      }
   }
}

/**
 * Creates a button for navigation of ID NAVIGATION_BUTTON_ID
 * @returns {HTMLElement} HTML button element
 */
function createNavigationButton() {
   // If the button doesn't exist, create it
   if (!elementWithIDExists(NAVIGATION_BUTTON_ID)) {
      let button = document.createElement('button');
      button.id = NAVIGATION_BUTTON_ID;
   }
   return document.getElementById(NAVIGATION_BUTTON_ID);
}

/**
 * Counts the pieces of that specified color and value (if value is not undefined) on the board and return the count
 * @param board Board
 * @param color Color of piece to count
 * @param value Value of piece to count
 * @returns {number} Count of the pieces of that color (and value if value is not undefined)
 */
function countPieces(board, color, value) {
   let count = 0;
   // For each piece on board
   for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; ++j) {
         // If the color is same, set flag as true
         let piece = board[i][j];
         let colorIsSame = (piece.color === color);
         let valueIsSame = true;
         // If the value is provided and value of piece is not same, set the other flag as false
         if (value !== undefined && piece.value !== value)
            valueIsSame = false;
         // If both flags are true, increment the count
         if (colorIsSame && valueIsSame)
            ++count;
      }
   }
   // Return the count
   return count;
}

/**
 * Return the count of pieces only by color
 * @param board Board
 * @param color Piece color to count
 * @returns {number} Count of pieces by color
 */
function countPiecesByColor(board, color) {
   return countPieces(board, color, undefined);
}

/**
 * Returns the count of piece by color and value
 * @param board Board
 * @param color Piece color to count
 * @param value Piece value to count too
 * @returns {number} Count of pieces by color and value
 */
function countColoredPiecesByNumber(board, color, value) {
   return countPieces(board, color, value);
}

/**
 * Returns the row index of cell
 * @param cell Cell to get row index of
 * @returns {number} Row index of cell
 */
function getCellRowIndex(cell) {
   return cell.parentElement.rowIndex;
}

/**
 * Returns the column index of cell
 * @param cell Cell to get column index of
 * @returns {number} Column index of cell
 */
function getCellColIndex(cell) {
   return cell.cellIndex;
}

/**
 * Returns true if the coordinates are inside board dimensions
 * @param board Board
 * @param newRow new row coordinate
 * @param newColumn new column coordinate
 * @returns {boolean} True if coordinates are inside board dimensions, else false
 */
function coordinatesInsideBounds(board, newRow, newColumn) {
   return newRow >= 0 && newRow < board.length && newColumn >= 0 && newColumn < board[newRow].length;
}

/**
 * Updates the status information in status pane, displays stage and round. Also displays count of both player pieces
 * if stage is PLAY
 * @param statusPane Status pane element
 * @param board Board
 */
function updateStatus(statusPane, board) {
   statusPane.innerText = stage + " Stage";
   if (stage !== END)
      statusPane.innerText += ", Round " + round;
   // If the stage is play, also include piece counts
   if (stage === PLAY) {
      let playerPieces = countPiecesByColor(board, PLAYER_COLOR);
      let computerPieces = countPiecesByColor(board, COMPUTER_COLOR);
      statusPane.innerText += ", " + PLAYER_COLOR + ": " + playerPieces + ", " + COMPUTER_COLOR + ": " + computerPieces;
   }
}

/**
 * Displays the specified message on the message pane
 * @param messagePane Message pane element
 * @param msg Message to display
 */
function displayMessage(messagePane, msg) {
   messagePane.innerText = msg;
}

/**
 * Determine who has won by counting the number of pieces of each player on board
 * @param board Board
 * @returns {string|number} COMPUTER_COLOR if computer has won, PLAYER_COLOR if player has won, 0 if no one has won
 */
function whoWon(board) {
   let playerCount = countPiecesByColor(board, PLAYER_COLOR);
   let computerCount = countPiecesByColor(board, COMPUTER_COLOR);
   if (playerCount === 0)
      return COMPUTER_COLOR;
   else if (computerCount === 0)
      return PLAYER_COLOR;
   else
      return 0;
}

/**
 * Displays a blinking error on the error pane
 * @param errorPane Error pane element
 * @param message Message to display
 */
function displayError(errorPane, message) {
   let actualColor = '#FF4242';
   errorPane.style.backgroundColor = 'red';
   errorPane.innerText = message;
   setTimeout(function () {
      errorPane.style.backgroundColor = actualColor;
   }, 50);
}

/**
 * Returns all the possible moves
 * @param board Board
 * @param color Player color
 * @returns {*[]} All possible moves in [row, col, newRow, newCol]
 */
function getAllPossibleMoves(board, color) {
   let moves = [];
   let opponentColor = (color === PLAYER_COLOR) ? COMPUTER_COLOR : PLAYER_COLOR;
   // For each piece on the board
   for (let i = 0; i < board.length; ++i) {
      for (let j = 0; j < board[i].length; ++j) {
         let piece = board[i][j];
         // If the current piece is of computer color
         if (piece.color === color) {
            // For all the different displacements
            let displacements = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (let k = 0; k < displacements.length; k++) {
               let deltaRow = displacements[k][0];
               let deltaCol = displacements[k][1];
               // Calculate the new coordinates
               let newRow = i + deltaRow;
               let newCol = j + deltaCol;
               // If the new coordinates are valid and there isn't a block in the new coordinates as well as computer piece
               if (coordinatesInsideBounds(board, newRow, newCol) && board[newRow][newCol].color !== BLOCK && board[newRow][newCol].color !== color) {
                  let newPiece = board[newRow][newCol];
                  // If the new piece is of player, and the computer can beat the player then add it in the list of possible moves
                  if (newPiece.color === opponentColor) {
                     if ((piece.value === 1 && newPiece.value === 4)) {
                        moves.push([i, j, newRow, newCol]);
                     } else if (!(piece.value === 4 && newPiece.value === 1) && piece.value > newPiece.value) {
                        moves.push([i, j, newRow, newCol]);
                     }
                  }
                  // Else just register the move
                  else {
                     moves.push([i, j, newRow, newCol]);
                  }
               }
            }
         }
      }
   }
   // Return the list of moves
   return moves;
}

/**
 * Simulates the computer turn after some time and moves the piece on the board. Ends the game if someone has won or no
 * move is left for the player.
 * @param board Board
 * @param grid Grid element
 * @param messagePane Message pane element
 * @param errorPane Error pane element
 * @param statusPane Status pane element
 * @param endButton End button element
 */
function computerTurn(board, grid, messagePane, errorPane, statusPane, endButton) {
   // Update the statuses
   displayMessage(messagePane, "Computer is thinking");
   updateStatus(statusPane, board);
   // Get the computer move after some waiting
   setTimeout(function () {
      // Get all the computer moves
      let moveAvailable = true;
      let moves = getAllPossibleMoves(board, COMPUTER_COLOR);
      // If there's no move
      if (moves.length === 0) {
         displayMessage(messagePane, "No moves left for computer.");
         moveAvailable = false;
      }
      // If there's any move available
      if (moveAvailable) {
         // Get the move that is on the player piece (as only the computer winning move will be provided)
         let moveToPlay = null;
         for (let i = 0; i < moves.length; i++) {
            let row = moves[i][0], column = moves[i][1], newRow = moves[i][2], newColumn = moves[i][3];
            if (board[newRow][newColumn].color === PLAYER_COLOR) {
               moveToPlay = [row, column, newRow, newColumn];
            }
         }
         // If there's no move that can eliminate the player, select a random move
         if (moveToPlay === null) {
            moveToPlay = moves[Math.floor((Math.random() * moves.length))];
         }
         // Extract all the attributes of the move and perform the move
         let row = moveToPlay[0], column = moveToPlay[1], newRow = moveToPlay[2], newColumn = moveToPlay[3];
         board[newRow][newColumn] = board[row][column];
         board[row][column] = createBoardPiece(EMPTY, EMPTY_VALUE);

         displayMessage(messagePane, "Computer has performed it's move. Your turn!");

         // If someone has won, end the game by clicking the end button
         let playerWon = whoWon(board);
         if (playerWon !== 0) {
            endButton.click();
         }
      }
      // Else if there's no move available
      else {
         endButton.click();
         displayError(errorPane, "The computer is tired");
         displayMessage(messagePane, "No move available for the computer. You Won!");
      }
      // Update the statues and frontend
      ++round;
      updateFrontend(grid, board);
      updateStatus(statusPane, board);
   }, 1000);
}


/**
 * Simulates the player turn
 * @param board Board
 * @param grid Grid element
 * @param row Row index of the cell that the user has selected
 * @param column Column index of the cell that the user has selected
 * @param messagePane Message pane element
 * @param errorPane Error pane element
 * @param statusPane Status pane element
 * @param endButton End button element
 * @param keyPressed Key that was pressed
 * @returns {boolean} True if computer should perform a turn (move valid and game is not over), else false
 */
function playerTurn(board, grid, row, column, messagePane, errorPane, statusPane, endButton, keyPressed) {

   let computerTurn = true;
   // If there's no move left
   if (getAllPossibleMoves(board, PLAYER_COLOR).length === 0) {
      computerTurn = false;
      endButton.click();
      displayError(errorPane, "No move is left for you");
      displayMessage(messagePane, "No move available for the you. Computer Won!");
   }
   // Else if there's a move left
   else {
      // If the selected item is not of the player color, display error
      if (board[row][column].color !== PLAYER_COLOR) {
         displayError(errorPane, "Please select a " + PLAYER_COLOR + " piece");
         computerTurn = false;
      }
      // Else if the selected item is of the player color
      else {
         let playerPiece = board[row][column];
         // Calculate the new row and new column depending upon user input
         let newRow = row, newColumn = column;
         if (keyPressed === 'w') {
            --newRow;
         } else if (keyPressed === 's') {
            ++newRow;
         } else if (keyPressed === 'a') {
            --newColumn;
         } else if (keyPressed === 'd') {
            ++newColumn;
         }
         // Else if the key pressed is invalid, display error as it is not a valid move
         else {
            displayError(errorPane, "Invalid key pressed");
            computerTurn = false;
         }
         // If the user input was valid
         if (computerTurn) {
            // If the new coordinates are inside the bounds
            if (coordinatesInsideBounds(board, newRow, newColumn)) {
               // If the new coordinates are of a block, it's not a valid move
               if (board[newRow][newColumn].color === BLOCK) {
                  displayError(errorPane, "Cannot move on a block");
                  computerTurn = false;
               }
               // Else if the new coordinates are on your fellow piece, it's not a valid move
               else if (board[newRow][newColumn].color === RED) {
                  displayError(errorPane, "Cannot move on your piece");
                  computerTurn = false;
               }
               // Else if the new coordinates are on empty piece, it's a valid move
               else if (board[newRow][newColumn].color === EMPTY) {
                  board[newRow][newColumn] = playerPiece;
                  board[row][column] = createBoardPiece(EMPTY, EMPTY_VALUE);
               }
               // Else the new coordinates are on the computer piece. Calculate who won
               else {
                  // Value of player piece is greater than computer piece or player piece is 1 and computer piece 4
                  let computerPiece = board[newRow][newColumn];
                  if (playerPiece.value === 1 && computerPiece.value === 4) {
                     // Eliminate the computer piece (overwrite)
                     board[newRow][newColumn] = playerPiece;
                  } else if ((playerPiece.value > computerPiece.value) && !(playerPiece.value === 4 && computerPiece.value === 1)) {
                     board[newRow][newColumn] = playerPiece;
                  }
                  // Make the player old position empty
                  board[row][column] = createBoardPiece(EMPTY, EMPTY_VALUE);
               }
            } else {
               displayError(errorPane, "The move is not inside the map");
               computerTurn = false;
            }
         }
      }
   }

   // If someone has won, don't simulate computer turn and end the execution
   if (computerTurn) {
      let playerWon = whoWon(board);
      if (playerWon !== 0) {
         computerTurn = false;
         endButton.click();
      }
   }
   // Update the frontend and status
   updateFrontend(grid, board);
   updateStatus(statusPane, board);

   // Return the flag determining whether the computer should perform its turn or not
   return computerTurn;
}

/**
 * Simulates the turn based play of the game
 * @param board Board
 * @param grid Grid element
 * @param row Row which was selected
 * @param column Column which was selected
 * @param messagePane Message pane element
 * @param errorPane Error pane element
 * @param statusPane Status pane element
 * @param endButton End button element
 * @param keyPressed Key which was pressed
 * @return {*[]}
 */
function play(board, grid, row, column, messagePane, errorPane, statusPane, endButton, keyPressed) {
   // Simulate the player turn
   let changeRound = playerTurn(board, grid, row, column, messagePane, errorPane, statusPane, endButton, keyPressed);

   // If round has to be changed
   if (changeRound) {
      // Increment the round, update the front end and status
      updateFrontend(grid, board);
      updateStatus(statusPane, board);
      // Simulate the computer turn
      computerTurn(board, grid, messagePane, errorPane, statusPane, endButton);
      // Update the front end and status
      updateFrontend(grid, board);
      updateStatus(statusPane, board);
   }
}

/**
 * Simulates the setup phase of the game
 * @param board Board
 * @param row Selected row index
 * @param column Selected column index
 * @param messagePane Message pane element
 * @param statusPane Status pane element
 * @param errorPane Error pane element
 * @param endButton End button element
 * @param keyPressed Key that was pressed
 */
function setup(board, row, column, messagePane, statusPane, errorPane, endButton, keyPressed) {
   let selectedPiece = board[row][column];
   // If the active element is not empty
   if (selectedPiece.color !== EMPTY) {
      displayError(errorPane, 'Cannot change piece. Cell already filled');
   }
   // Else if it's first round
   else if (round === 1) {
      // If correct key is pressed, place a block
      if (keyPressed === 'b') {
         board[row][column] = createBoardPiece(BLOCK, BLOCK_VALUE);
      } else {
         displayError(errorPane, 'Invalid Key Pressed!');
      }
   }
   // Else if it's second or third round
   else if (round === 2 || round === 3) {
      // Determine the color depending upon the round
      let color = (round === 2) ? PLAYER_COLOR : COMPUTER_COLOR;
      // If the key pressed is in allowed pieces
      keyPressed = parseInt(keyPressed);
      if (keyPressed in MAX_PIECES_ALLOWED_BY_NUMBER) {
         let countColored = countPiecesByColor(board, color);
         let countNumberedColored = countColoredPiecesByNumber(board, color, keyPressed);
         let maxNumberedPiecesAllowed = MAX_PIECES_ALLOWED_BY_NUMBER[keyPressed];
         // If the player has placed more than total allowed pieces
         if (countColored >= MAX_PLAYER_PIECES_ALLOWED) {
            displayError(errorPane, "Cannot place more than " + MAX_PLAYER_PIECES_ALLOWED + " pieces");
         }
         // Else if the player has placed more than allowed pieces of the specific number
         else if (countNumberedColored >= maxNumberedPiecesAllowed) {
            displayError(errorPane, "You cannot place any more pieces with that number");
         }
         // Else place the piece
         else {
            board[row][column] = createBoardPiece(color, keyPressed);
         }
      }
      // Else the key press is invalid
      else {
         displayError(errorPane, 'Invalid Piece Number!');
      }
   }
}


function updateNavigationButton(board, grid, statusPane, messagePane, errorPane, navigationButton) {
   // Update the frontend and status
   updateFrontend(grid, board);
   updateStatus(statusPane, board);
   // If it's the setup stage
   if (stage === SETUP) {
      // If round is 1, update the round and message
      if (round === 1) {
         ++round;
         displayMessage(messagePane, "Place " + PLAYER_COLOR + " pieces. Select a cell and press 1-4 to add piece (Max " + MAX_PLAYER_PIECES_ALLOWED + ")");
      }
      // Else if it's the second or third round
      else if (round === 2 || round === 3) {
         // Get the color
         let color = (round === 2) ? PLAYER_COLOR : COMPUTER_COLOR;
         // If there are no pieces on the board
         if (countPiecesByColor(board, color) === 0) {
            displayError(errorPane, "At least one " + color + " piece should be placed on the board");
         }
         // Else if the round is 2nd
         else if (round === 2) {
            // Update the message, round and the inner text of button
            displayMessage(messagePane, "Place " + COMPUTER_COLOR + " pieces. Select a cell and press 1-4 to add piece (Max " + MAX_PLAYER_PIECES_ALLOWED + ")");
            ++round;
            navigationButton.innerText = 'Play';
         }
         // Else update the stage
         else {
            round = 1;
            stage = PLAY;
            displayMessage(messagePane, "Let's play. Your Turn!");
            navigationButton.innerText = 'End';
         }
      }
   } else if (stage === PLAY) {
      stage = END;
      let playerWon = whoWon(board);
      if (playerWon === 0) {
         displayMessage(messagePane, "Game Over. No one won!");
      } else if (playerWon === PLAYER_COLOR) {
         displayMessage(messagePane, "Game Over. You Won!");
      } else if (playerWon === COMPUTER_COLOR) {
         displayMessage(messagePane, "Game Over. Computer Won!");
      }
      navigationButton.innerText = 'Restart';
   } else {
      document.location.reload();
   }
   // Update the frontend and status again
   updateFrontend(grid, board);
   updateStatus(statusPane, board);
}


