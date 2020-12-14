// Tic-Tac-Toe with 1 player vs ai.

// Canvas setup.
const cnv = document.createElement("canvas");
const ctx = cnv.getContext("2d");
const cnvSize = 300;
cnv.setAttribute("height", cnvSize.toString());
cnv.setAttribute("width", cnvSize.toString());
cnv.addEventListener("click", makeHumanTurn);
document.body.appendChild(cnv);

// Information message setup.
const infoText = document.createElement("p");
document.body.appendChild(infoText);

// Board generation.
const boardSize = 3;
let board = [];
for (let y = 0; y < boardSize; y++) {
    board[y] = [];
    for (let x = 0; x < boardSize; x++) {
        board[y][x] = "-"
    }
}

// Player Assignment.
let humanPlayer;
while (humanPlayer === undefined ||  (humanPlayer !== "X" && humanPlayer !== "O")) {
    humanPlayer = prompt("Would you like to play as X or O?").toUpperCase();
}
let aiPlayer = humanPlayer === "O" ? "X" : "O";

// Start the game.
drawBoard();
if (player(board) === aiPlayer) {
    setTimeout(makeAITurn, 2000);
} else {
    infoText.innerText = "Waiting for your move...";
}


// Draws the board in it's current state.
function drawBoard() {
    let cellSize = cnvSize / boardSize;
    ctx.fillRect(0, 0, cnvSize, cnvSize);
    ctx.strokeStyle = "#FFFFFF";
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            ctx.strokeRect(cellSize*x, cellSize*y, cellSize, cellSize);
            ctx.beginPath();

            if (board[y][x] === "O") {
                ctx.arc(cellSize * x + cellSize / 2, cellSize * y + cellSize / 2, cellSize / 4, 0, 2 * Math.PI);
            } else if (board[y][x] === "X") {
                ctx.moveTo(cellSize*x + cellSize / 4, cellSize*y + cellSize / 4);
                ctx.lineTo(cellSize*x + cellSize - cellSize / 4, cellSize*y + cellSize - cellSize / 4);
                ctx.moveTo(cellSize*x + cellSize / 4, cellSize*y + cellSize - cellSize / 4);
                ctx.lineTo(cellSize*x + cellSize - cellSize / 4, cellSize*y + cellSize / 4);
            }

            ctx.stroke();
        }
    }
}

// Process an click from the human player.
function makeHumanTurn(event) {
    let positionX = Math.floor(event.clientX / (cnvSize / boardSize));
    let positionY = Math.floor(event.clientY / (cnvSize / boardSize));
    let currentPlayer = player(board);
    if (currentPlayer === humanPlayer && !terminal(board)) {
        if (board[positionY][positionX] !== "-") {
            alert("That square is already taken.");
            return -1
        } else {
            board[positionY][positionX] = humanPlayer;
            drawBoard();
        }

        if (!terminal(board)) {
            infoText.innerText = "AI is making it's move...";
            setTimeout(makeAITurn, 2000)
        } else {
            gameOver();
        }
    }
}


// Make the optimal move based on the board state.
function makeAITurn() {
    if (player(board) === aiPlayer) {
        let bestMove = minimax(board);
        let newBoard = result(board, bestMove);
        board = newBoard.slice();
        drawBoard();
        if (!terminal(board)) {
            infoText.innerText = "Waiting for your move...";
        } else {
            gameOver();
        }
    }
}


// Get who's turn it is to go.
function player(board) {
    let x_placed = 0;
    let o_placed = 0;

    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            if (board[y][x] === "X") {
                x_placed++;
            } else if (board[y][x] === "O") {
                o_placed++;
            }
        }
    }
    return x_placed === o_placed ? "X" : "O";
}


// Get who won the game.
function winner(board) {
    let winSize = 3;
    let win;
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            if (x <= boardSize - winSize) { // Check Horizontal.
                win = true;
                for (let i = 0; i < winSize; i++) {
                    if (!(board[y][x] === board[y][x + i] && board[y][x] !== "-")) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    return board[y][x];
                }
            }

            if (y <= boardSize - winSize) { // Check Vertical.
                win = true;
                for (let i = 0; i < winSize; i++) {
                    if (!(board[y][x] === board[y + i][x] && board[y][x] !== "-")) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    return board[y][x];
                }
            }

            if (x <= boardSize - winSize && y <= boardSize - winSize) { // Check Diagonal.
                win = true;
                for (let i = 0; i < winSize; i++) {
                    if (!(board[y][x] === board[y+i][x+i] && board[y][x] !== "-")) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    return board[y][x];
                }
            }

            if (x >= boardSize - winSize && y <= boardSize - winSize) { // Check Diagonal.
                win = true;
                for (let i = 0; i < winSize; i++) {
                    if (!(board[y][x] === board[y+i][x-i] && board[y][x] !== "-")) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    return board[y][x];
                }
            }
        }
    }
}


// Check if the game is over.
function terminal(board) {
    let boardFilled = true;
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            if (board[y][x] === "-") {
                boardFilled = false;
                break;
            }
        }
    }
    return boardFilled || winner(board) !== undefined;
}


// Get all possible moves for the current state.
function actions(board) {
    let possible_actions = [];

    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            if (board[y][x] === "-") {
                possible_actions.push([x,y]);
            }
        }
    }
    return possible_actions;
}


// Get the resulting board after a move has been made.
function result(board, action) {
    let board_copy = [];
    for (let i = 0; i < boardSize; i++) {
        board_copy[i] = board[i].slice();
    }

    if (board_copy[action[1]][action[0]] !== "-") {
        throw Error;
    }

    board_copy[action[1]][action[0]] = player(board);
    return board_copy;
}


// Get the score for a given board.
function utility(board) {
    let game_winner = winner(board);
    if (game_winner === "X") {
        return 1
    } else if (game_winner === "O") {
        return -1;
    } else {
        return 0;
    }
}

// Get the max score achievable given the provided board.
function maxValue(board) {
    if (terminal(board)) {
        return utility(board)
    }
    let v = -Infinity;
    actions(board).forEach(function (action) {
        v = Math.max(v, minValue(result(board, action)));
    });
    return v;
}


// Get the min score achievable given the provided board.
function minValue(board) {
    if (terminal(board)) {
        return utility(board)
    }
    let v = Infinity;
    actions(board).forEach(function (action) {
        v = Math.min(v, maxValue(result(board, action)));
    });
    return v;
}


// Get the optimal move to make.
function minimax(board) {
    if (terminal(board)) {
        return undefined;
    }

    let bestMove;
    if (player(board) === "X") {
        let v = -Infinity;
        actions(board).forEach(function (action) {
            let newV = Math.max(minValue(result(board, action)));
            if (newV > v) {
                bestMove = action;
                v = newV;
            }
        });
    } else if (player(board) === "O") {
        let v = Infinity;
        actions(board).forEach(function (action) {
            let newV = Math.min(maxValue(result(board, action)));
            if (newV < v) {
                bestMove = action;
                v = newV;
            }
        });
    }
    return bestMove;
}


// Restart the game.
function gameOver() {
    let winning_player = winner(board);
    if (winning_player === undefined) {
        infoText.innerText = "It's a tie!, restarting in 3 seconds.";
    } else {
        infoText.innerText = winner(board) + " Wins!, restarting in 3 seconds.";
    }

    setTimeout(function () {
        window.location.reload();
    }, 3000);
}

