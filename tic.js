const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function checkWinner() {
    for (let pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            statusText.textContent = `${currentPlayer} Wins! 🎉`;
            isGameActive = false;
            highlightWinningCells(pattern);
            return;
        }
    }

    if (!board.includes('')) {
        statusText.textContent = "It's a Draw!";
        isGameActive = false;
    }
}

function highlightWinningCells(pattern) {
    pattern.forEach(index => {
        cells[index].style.backgroundColor = '#28a745';
    });
}

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] === '' && isGameActive) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('taken');

        checkWinner();

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (isGameActive) {
            statusText.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `Player X's Turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
        cell.style.backgroundColor = '#ddd';
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
