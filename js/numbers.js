const ROWS=5,COLUMNS=5,RED="red",BLACK="black",BLOCK="block",EMPTY="empty",EMPTY_VALUE="<br>",BLOCK_VALUE="B",PLAYER_COLOR=RED,COMPUTER_COLOR=BLACK,SETUP="Setup",PLAY="Play",END="End",MAX_PLAYER_PIECES_ALLOWED=8,MAX_PIECES_ALLOWED_BY_NUMBER={1:3,2:2,3:2,4:1},PANE_CLASS="pane",MESSAGE_PANE_ID="message",STATUS_PANE_ID="status",ERROR_PANE_ID="error",NAVIGATION_BUTTON_ID="btn",GRID_ID="grid",ACTIVE_CELL_ID="active";let stage=SETUP,round=1;function createBoardPiece(e,t){return{color:e,value:t}}function createBoard(){let e=[];for(let t=0;t<ROWS;t++){let t=[];for(let e=0;e<COLUMNS;e++)t.push(createBoardPiece(EMPTY,EMPTY_VALUE));e.push(t)}return e}function elementWithIDExists(e){return null!=document.getElementById(e)}function createGrid(e){if(!elementWithIDExists(GRID_ID)){let e=document.createElement("table");e.id=GRID_ID,document.body.appendChild(e)}let t=document.getElementById(GRID_ID);t.innerHTML="";for(let o=0;o<e.length;++o){let n=document.createElement("tr");t.appendChild(n);for(let t=0;t<e[o].length;++t){let e=document.createElement("td");n.appendChild(e)}}return t}function createPane(e){if(!elementWithIDExists(e)){let t=document.createElement("div");t.classList.add(PANE_CLASS),t.id=e,document.body.appendChild(t)}return document.getElementById(e)}function updateFrontend(e,t){let o=e.querySelectorAll("tr");for(let e=0;e<o.length;++e){let n=o[e].querySelectorAll("td");for(let o=0;o<n.length;++o){let r=n[o];r.removeAttribute("class"),r.classList.add(t[e][o].color),r.innerHTML=t[e][o].value}}}function createNavigationButton(){if(!elementWithIDExists(NAVIGATION_BUTTON_ID)){document.createElement("button").id=NAVIGATION_BUTTON_ID}return document.getElementById(NAVIGATION_BUTTON_ID)}function countPieces(e,t,o){let n=0;for(let r=0;r<e.length;r++)for(let l=0;l<e[r].length;++l){let a=e[r][l],i=a.color===t,u=!0;void 0!==o&&a.value!==o&&(u=!1),i&&u&&++n}return n}function countPiecesByColor(e,t){return countPieces(e,t,void 0)}function countColoredPiecesByNumber(e,t,o){return countPieces(e,t,o)}function getCellRowIndex(e){return e.parentElement.rowIndex}function getCellColIndex(e){return e.cellIndex}function coordinatesInsideBounds(e,t,o){return t>=0&&t<e.length&&o>=0&&o<e[t].length}function updateStatus(e,t){if(e.innerText=stage+" Stage",stage!==END&&(e.innerText+=", Round "+round),stage===PLAY){let o=countPiecesByColor(t,PLAYER_COLOR),n=countPiecesByColor(t,COMPUTER_COLOR);e.innerText+=", "+PLAYER_COLOR+": "+o+", "+COMPUTER_COLOR+": "+n}}function displayMessage(e,t){e.innerText=t}function whoWon(e){let t=countPiecesByColor(e,PLAYER_COLOR),o=countPiecesByColor(e,COMPUTER_COLOR);return 0===t?COMPUTER_COLOR:0===o?PLAYER_COLOR:0}function displayError(e,t){e.style.backgroundColor="red",e.innerText=t,setTimeout(function(){e.style.backgroundColor="#FF4242"},50)}function getAllPossibleMoves(e,t){let o=[],n=t===PLAYER_COLOR?COMPUTER_COLOR:PLAYER_COLOR;for(let r=0;r<e.length;++r)for(let l=0;l<e[r].length;++l){let a=e[r][l];if(a.color===t){let i=[[-1,0],[1,0],[0,-1],[0,1]];for(let u=0;u<i.length;u++){let s=r+i[u][0],d=l+i[u][1];if(coordinatesInsideBounds(e,s,d)&&e[s][d].color!==BLOCK&&e[s][d].color!==t){let t=e[s][d];t.color===n?1===a.value&&4===t.value?o.push([r,l,s,d]):(4!==a.value||1!==t.value)&&a.value>t.value&&o.push([r,l,s,d]):o.push([r,l,s,d])}}}}return o}function computerTurn(e,t,o,n,r,l){displayMessage(o,"Computer is thinking"),updateStatus(r,e),setTimeout(function(){let a=!0,i=getAllPossibleMoves(e,COMPUTER_COLOR);if(0===i.length&&(displayMessage(o,"No moves left for computer."),a=!1),a){let t=null;for(let o=0;o<i.length;o++){let n=i[o][0],r=i[o][1],l=i[o][2],a=i[o][3];e[l][a].color===PLAYER_COLOR&&(t=[n,r,l,a])}null===t&&(t=i[Math.floor(Math.random()*i.length)]);let n=t[0],r=t[1],a=t[2],u=t[3];e[a][u]=e[n][r],e[n][r]=createBoardPiece(EMPTY,EMPTY_VALUE),displayMessage(o,"Computer has performed it's move. Your turn!"),0!==whoWon(e)&&l.click()}else l.click(),displayError(n,"The computer is tired"),displayMessage(o,"No move available for the computer. You Won!");++round,updateFrontend(t,e),updateStatus(r,e)},1e3)}function playerTurn(e,t,o,n,r,l,a,i,u){let s=!0;if(0===getAllPossibleMoves(e,PLAYER_COLOR).length)s=!1,i.click(),displayError(l,"No move is left for you"),displayMessage(r,"No move available for the you. Computer Won!");else if(e[o][n].color!==PLAYER_COLOR)displayError(l,"Please select a "+PLAYER_COLOR+" piece"),s=!1;else{let t=e[o][n],r=o,a=n;if("w"===u?--r:"s"===u?++r:"a"===u?--a:"d"===u?++a:(displayError(l,"Invalid key pressed"),s=!1),s)if(coordinatesInsideBounds(e,r,a))if(e[r][a].color===BLOCK)displayError(l,"Cannot move on a block"),s=!1;else if(e[r][a].color===RED)displayError(l,"Cannot move on your piece"),s=!1;else if(e[r][a].color===EMPTY)e[r][a]=t,e[o][n]=createBoardPiece(EMPTY,EMPTY_VALUE);else{let l=e[r][a];1===t.value&&4===l.value?e[r][a]=t:t.value>l.value&&(4!==t.value||1!==l.value)&&(e[r][a]=t),e[o][n]=createBoardPiece(EMPTY,EMPTY_VALUE)}else displayError(l,"The move is not inside the map"),s=!1}if(s){0!==whoWon(e)&&(s=!1,i.click())}return updateFrontend(t,e),updateStatus(a,e),s}function play(e,t,o,n,r,l,a,i,u){playerTurn(e,t,o,n,r,l,a,i,u)&&(updateFrontend(t,e),updateStatus(a,e),computerTurn(e,t,r,l,a,i),updateFrontend(t,e),updateStatus(a,e))}function setup(e,t,o,n,r,l,a,i){if(e[t][o].color!==EMPTY)displayError(l,"Cannot change piece. Cell already filled");else if(1===round)"b"===i?e[t][o]=createBoardPiece(BLOCK,BLOCK_VALUE):displayError(l,"Invalid Key Pressed!");else if(2===round||3===round){let n=2===round?PLAYER_COLOR:COMPUTER_COLOR;if((i=parseInt(i))in MAX_PIECES_ALLOWED_BY_NUMBER){let r=countPiecesByColor(e,n),a=countColoredPiecesByNumber(e,n,i),u=MAX_PIECES_ALLOWED_BY_NUMBER[i];r>=MAX_PLAYER_PIECES_ALLOWED?displayError(l,"Cannot place more than "+MAX_PLAYER_PIECES_ALLOWED+" pieces"):a>=u?displayError(l,"You cannot place any more pieces with that number"):e[t][o]=createBoardPiece(n,i)}else displayError(l,"Invalid Piece Number!")}}function updateNavigationButton(e,t,o,n,r,l){if(updateFrontend(t,e),updateStatus(o,e),stage===SETUP){if(1===round)++round,displayMessage(n,"Place "+PLAYER_COLOR+" pieces. Select a cell and press 1-4 to add piece (Max "+MAX_PLAYER_PIECES_ALLOWED+")");else if(2===round||3===round){let t=2===round?PLAYER_COLOR:COMPUTER_COLOR;0===countPiecesByColor(e,t)?displayError(r,"At least one "+t+" piece should be placed on the board"):2===round?(displayMessage(n,"Place "+COMPUTER_COLOR+" pieces. Select a cell and press 1-4 to add piece (Max "+MAX_PLAYER_PIECES_ALLOWED+")"),++round,l.innerText="Play"):(round=1,stage=PLAY,displayMessage(n,"Let's play. Your Turn!"),l.innerText="End")}}else if(stage===PLAY){stage=END;let t=whoWon(e);0===t?displayMessage(n,"Game Over. No one won!"):t===PLAYER_COLOR?displayMessage(n,"Game Over. You Won!"):t===COMPUTER_COLOR&&displayMessage(n,"Game Over. Computer Won!"),l.innerText="Restart"}else document.location.reload();updateFrontend(t,e),updateStatus(o,e)}