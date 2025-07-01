const PLAYER = 'X';
const COMPUTER = 'O';
let board = [];
let gameOver = false;

function resetBoard() {
  board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
  gameOver = false;
  document.getElementById("message").textContent = '';
}

function checkFreeSpaces() {
  let freeSpaces = 9;
  for (let row of board)
    for (let cell of row)
      if (cell !== ' ') freeSpaces--;
  return freeSpaces;
}

function playerMove(row, col) {
  if (board[row][col] === ' ' && !gameOver) {
    board[row][col] = PLAYER;
    updateBoardUI();
    let winner = checkWinner();
    if (winner !== ' ' || checkFreeSpaces() === 0) {
      endGame(winner);
    } else {
      setTimeout(() => {
        computerMove();
        updateBoardUI();
        let winner = checkWinner();
        if (winner !== ' ' || checkFreeSpaces() === 0) {
          endGame(winner);
        }
      }, 500); // Delay for realism
    }
  }
}

function computerMove() {
  // Try to win
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[i][j] === ' ') {
        board[i][j] = COMPUTER;
        if (checkWinner() === COMPUTER) return;
        board[i][j] = ' ';
      }

  // Block player
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[i][j] === ' ') {
        board[i][j] = PLAYER;
        if (checkWinner() === PLAYER) {
          board[i][j] = COMPUTER;
          return;
        }
        board[i][j] = ' ';
      }

  // Strategic move
  const priorities = [
    [1, 1], [0, 0], [0, 2], [2, 0], [2, 2],
    [0, 1], [1, 0], [1, 2], [2, 1]
  ];
  for (let [x, y] of priorities)
    if (board[x][y] === ' ') {
      board[x][y] = COMPUTER;
      return;
    }
}

function checkWinner() {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] &&
        board[i][0] === board[i][2] &&
        board[i][0] !== ' ') return board[i][0];
    if (board[0][i] === board[1][i] &&
        board[0][i] === board[2][i] &&
        board[0][i] !== ' ') return board[0][i];
  }
  if (board[0][0] === board[1][1] &&
      board[0][0] === board[2][2] &&
      board[0][0] !== ' ') return board[0][0];
  if (board[0][2] === board[1][1] &&
      board[0][2] === board[2][0] &&
      board[0][2] !== ' ') return board[0][2];
  return ' ';
}

function endGame(winner) {
  gameOver = true;
  if (winner === PLAYER) {
    document.getElementById("message").textContent = "🎉 YOU WIN!";
  } else if (winner === COMPUTER) {
    document.getElementById("message").textContent = "😢 YOU LOSE!";
  } else {
    document.getElementById("message").textContent = "😐 IT'S A TIE!";
  }
}

function updateBoardUI() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = '';
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = board[i][j];
      cell.onclick = () => playerMove(i, j);
      boardDiv.appendChild(cell);
    }
}

function startGame() {
  resetBoard();
  updateBoardUI();
}

// Start the game on load
window.onload = startGame;
