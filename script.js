const gameElements = {
    board: document.getElementById('board'),
    cells: document.querySelectorAll('.cell'),
    statusDisplay: document.querySelector('.status'),
    resetButton: document.getElementById('reset'),
    twoPlayerBtn: document.getElementById('two-player'),
    computerModeBtn: document.getElementById('computer-mode')
};

const game = {
    currentPlayer: 'X',
    state: ['', '', '', '', '', '', '', '', ''],
    isActive: true,
    vsComputer: false,

    // All possible winning combinations
    winningCombos: [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
};

// when a player clicks on a cell
function onCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.dataset.index);

    if (game.state[index] || !game.isActive) return;

    makeMove(cell, index);

    if (game.vsComputer && game.isActive && game.currentPlayer === 'O') {
        setTimeout(computerTurn, 500);
    }
}

function makeMove(cell, index) {
    game.state[index] = game.currentPlayer;
    cell.textContent = game.currentPlayer;
    cell.classList.add(game.currentPlayer.toLowerCase());

    checkGameStatus();
}

//computer-logic
function computerTurn() {
    if (!game.isActive) return;

    // 1. First check if computer can win immediately
    const winningMove = findStrategicMove('O');
    if (winningMove !== null) {
        makeMove(gameElements.cells[winningMove], winningMove);
        return;
    }

    // 2. Block player if they're about to win
    const blockingMove = findStrategicMove('X');
    if (blockingMove !== null) {
        makeMove(gameElements.cells[blockingMove], blockingMove);
        return;
    }

    // 3. Otherwise make a random move
    const emptyCells = game.state
        .map((val, idx) => val === '' ? idx : null)
        .filter(val => val !== null);

    if (emptyCells.length) {
        const randomIdx = Math.floor(Math.random() * emptyCells.length);
        const cellIndex = emptyCells[randomIdx];
        makeMove(gameElements.cells[cellIndex], cellIndex);
    }
}

function findStrategicMove(player) {
    for (const combo of game.winningCombos) {
        const [a, b, c] = combo;
        const cells = [game.state[a], game.state[b], game.state[c]];

        if (cells.filter(cell => cell === player).length === 2) {
            const emptyIndex = combo[cells.indexOf('')];
            if (game.state[emptyIndex] === '') {
                return emptyIndex;
            }
        }
    }
    return null;
}

//game-win-or-draw
function checkGameStatus() {
    const hasWinner = game.winningCombos.some(combo => {
        const [a, b, c] = combo;

        if (game.state[a] && game.state[a] === game.state[b] && game.state[a] === game.state[c]) {
            highlightWinningCells(combo);
            return true;
        }
        return false;
    });

    if (hasWinner) {
        gameElements.statusDisplay.textContent = `${game.currentPlayer} wins!`;
        game.isActive = false;
        return;
    }

    // Check-draw
    if (!game.state.includes('')) {
        gameElements.statusDisplay.textContent = "It's a draw!";
        game.isActive = false;
        return;
    }

    switchPlayer();
}

function highlightWinningCells(cellIndices) {
    cellIndices.forEach(idx => {
        gameElements.cells[idx].classList.add('winning-cell');
    });
}

function switchPlayer() {
    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    gameElements.statusDisplay.textContent = `${game.currentPlayer}'s turn`;
}

function resetGame() {
    game.currentPlayer = 'X';
    game.state = ['', '', '', '', '', '', '', '', ''];
    game.isActive = true;
    gameElements.statusDisplay.textContent = `${game.currentPlayer}'s turn`;

    gameElements.cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell'; // Reset all classes
    });
}

//game-mode-toggle
function setGameMode(computerMode) {
    game.vsComputer = computerMode;
    resetGame();

    if (computerMode) {
        gameElements.computerModeBtn.classList.add('active');
        gameElements.twoPlayerBtn.classList.remove('active');
    } else {
        gameElements.twoPlayerBtn.classList.add('active');
        gameElements.computerModeBtn.classList.remove('active');
    }
}

function initializeGame() {
    gameElements.cells.forEach(cell => {
        cell.addEventListener('click', onCellClick);
    });

    gameElements.resetButton.addEventListener('click', resetGame);
    gameElements.twoPlayerBtn.addEventListener('click', () => setGameMode(false));
    gameElements.computerModeBtn.addEventListener('click', () => setGameMode(true));

    //two-player-mode-default
    setGameMode(false);
}

//start
initializeGame();