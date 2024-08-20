const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const playerVsPlayerButton = document.getElementById('playerVsPlayer');
const playerVsAIButton = document.getElementById('playerVsAI');

let currentPlayer = 'X';
let board = Array(9).fill(null);
let isGameActive = false;
let mode = '';
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
playerVsPlayerButton.addEventListener('click', () => startGame('PvP'));
playerVsAIButton.addEventListener('click', () => startGame('PvAI'));
resetButton.addEventListener('click', resetGame);
cells.forEach(cell => cell.addEventListener('click', handleClick));
function startGame(gameMode) {
    mode = gameMode;
    isGameActive = true;
    currentPlayer = 'X';
    board = Array(9).fill(null);
    status.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto';
    });
}
function handleClick(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] || !isGameActive) return;
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    if (checkWinner()) {
        status.textContent = `${currentPlayer} wins!`;
        isGameActive = false;
        cells.forEach(cell => cell.style.pointerEvents = 'none');
    } else if (board.every(cell => cell)) {
        status.textContent = "It's a draw!";
        isGameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        if (mode === 'PvAI' && currentPlayer === 'O') {
            setTimeout(aiMove, 500);
        }
    }
}
function checkWinner() {
    return winningCombos.some(combo => {
        const [a, b, c] = combo;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}
function aiMove() {
    const emptyIndices = board.map((value, index) => value === null ? index : null).filter(index => index !== null);
    if (emptyIndices.length === 0) return;
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    board[randomIndex] = 'O';
    document.querySelector(`.cell[data-index="${randomIndex}"]`).textContent = 'O';
    if (checkWinner()) {
        status.textContent = `O wins!`;
        isGameActive = false;
        cells.forEach(cell => cell.style.pointerEvents = 'none');
    } else if (board.every(cell => cell)) {
        status.textContent = "It's a draw!";
        isGameActive = false;
    } else {
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
}
function resetGame() {
    isGameActive = false;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto';
    });
    status.textContent = 'Game reset. Choose a mode to start again.';
}