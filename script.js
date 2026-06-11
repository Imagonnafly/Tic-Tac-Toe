const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('statusMessage');
const restartBtn = document.getElementById('restartBtn');

const pvpBtn = document.getElementById('pvpBtn');
const aiBtn = document.getElementById('aiBtn');
const sideGroup = document.getElementById('sideGroup');
const difficultyGroup = document.getElementById('difficultyGroup');
const pickXBtn = document.getElementById('pickXBtn');
const pickOBtn = document.getElementById('pickOBtn');
const diffButtons = document.querySelectorAll('.diff-btn');

const statX = document.getElementById('statX');
const statDraws = document.getElementById('statDraws');
const statO = document.getElementById('statO');

const themeDropdown = document.getElementById('themeDropdown');
const dropdownTrigger = document.getElementById('dropdownTrigger');
const triggerText = dropdownTrigger.querySelector('.trigger-text');
const dropdownItems = document.querySelectorAll('.dropdown-item');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; 
let isGameActive = true;

let isAiMode = false;
let userSide = "X"; 
let currentDifficulty = "normal"; 

let scores = { X: 0, draws: 0, O: 0 };
let currentSymbols = { X: "❌", O: "⭕" };

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

const THEMES = {
    modern: { symbols: { X: "❌", O: "⭕" }, styles: { '--bg-gradient': 'linear-gradient(45deg, #0f172a, #1e1b4b, #311042, #0f172a)', '--card-color': 'rgba(15, 23, 42, 0.65)', '--cell-color': 'rgba(30, 41, 59, 0.5)', '--cell-hover': 'rgba(79, 70, 229, 0.4)', '--accent-x': '#38bdf8', '--accent-o': '#f43f5e', '--text-color': '#f8fafc', '--glow-color': '#6366f1', '--board-glow': '0 0 40px rgba(99, 102, 241, 0.4)', '--font-family': "'Segoe UI', system-ui, sans-serif", '--border-radius-global': '24px', '--cell-radius': '16px', '--board-border': '1px solid rgba(255, 255, 255, 0.05)', '--cell-border': '1px solid rgba(255, 255, 255, 0.05)', '--dropdown-bg': 'rgba(15, 23, 42, 0.95)' } },
    ocean: { symbols: { X: "⭐", O: "🐙" }, styles: { '--bg-gradient': 'linear-gradient(135deg, #03045e, #0077b6, #00b4d8, #03045e)', '--card-color': 'rgba(3, 4, 94, 0.7)', '--cell-color': 'rgba(0, 119, 182, 0.35)', '--cell-hover': 'rgba(0, 180, 216, 0.55)', '--accent-x': '#ffb703', '--accent-o': '#fb8500', '--text-color': '#caf0f8', '--glow-color': '#00b4d8', '--board-glow': '0 0 35px rgba(0, 180, 216, 0.5)', '--font-family': "'Segoe UI', sans-serif", '--border-radius-global': '24px', '--cell-radius': '16px', '--board-border': '1px solid rgba(255, 255, 255, 0.05)', '--cell-border': '1px solid rgba(255, 255, 255, 0.05)', '--dropdown-bg': 'rgba(3, 4, 94, 0.95)' } },
    fire: { symbols: { X: "🔥", O: "☄️" }, styles: { '--bg-gradient': 'linear-gradient(45deg, #370000, #6a040f, #dc2f02, #370000)', '--card-color': 'rgba(55, 0, 0, 0.75)', '--cell-color': 'rgba(106, 4, 15, 0.4)', '--cell-hover': 'rgba(220, 47, 2, 0.6)', '--accent-x': '#ffea00', '--accent-o': '#e85d04', '--text-color': '#fff3b0', '--glow-color': '#dc2f02', '--board-glow': '0 0 45px rgba(220, 47, 2, 0.6)', '--font-family': "'Segoe UI', sans-serif", '--border-radius-global': '24px', '--cell-radius': '16px', '--board-border': '1px solid rgba(255, 255, 255, 0.05)', '--cell-border': '1px solid rgba(255, 255, 255, 0.05)', '--dropdown-bg': 'rgba(55, 0, 0, 0.95)' } },
    air: { symbols: { X: "⚡", O: "🌪️" }, styles: { '--bg-gradient': 'linear-gradient(135deg, #1e293b, #475569, #94a3b8, #1e293b)', '--card-color': 'rgba(30, 41, 59, 0.7)', '--cell-color': 'rgba(71, 85, 105, 0.35)', '--cell-hover': 'rgba(148, 163, 184, 0.55)', '--accent-x': '#fff200', '--accent-o': '#38bdf8', '--text-color': '#f8fafc', '--glow-color': '#cbd5e1', '--board-glow': '0 0 35px rgba(203, 213, 225, 0.4)', '--font-family': "'Segoe UI', sans-serif", '--border-radius-global': '24px', '--cell-radius': '16px', '--board-border': '1px solid rgba(255, 255, 255, 0.05)', '--cell-border': '1px solid rgba(255, 255, 255, 0.05)', '--dropdown-bg': 'rgba(30, 41, 59, 0.95)' } },
    earth: { symbols: { X: "🌳", O: "🪨" }, styles: { '--bg-gradient': 'linear-gradient(45deg, #14532d, #166534, #15803d, #14532d)', '--card-color': 'rgba(20, 83, 45, 0.75)', '--cell-color': 'rgba(22, 101, 52, 0.4)', '--cell-hover': 'rgba(21, 128, 61, 0.6)', '--accent-x': '#fde047', '--accent-o': '#f97316', '--text-color': '#f0fdf4', '--glow-color': '#22c55e', '--board-glow': '0 0 40px rgba(34, 197, 94, 0.5)', '--font-family': "'Segoe UI', sans-serif", '--border-radius-global': '24px', '--cell-radius': '16px', '--board-border': '1px solid rgba(255, 255, 255, 0.05)', '--cell-border': '1px solid rgba(255, 255, 255, 0.05)', '--dropdown-bg': 'rgba(20, 83, 45, 0.95)' } }
};

dropdownTrigger.addEventListener('click', (e) => { e.stopPropagation(); themeDropdown.classList.toggle('open'); });
document.addEventListener('click', () => { themeDropdown.classList.remove('open'); });
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const themeValue = item.getAttribute('data-value');
        triggerText.textContent = item.querySelector('.item-text').textContent;
        themeDropdown.classList.remove('open');
        executeThemeChange(themeValue);
    });
});

function executeThemeChange(value) {
    const activeTheme = THEMES[value];
    for (const [property, val] of Object.entries(activeTheme.styles)) {
        document.documentElement.style.setProperty(property, val);
    }
    currentSymbols = activeTheme.symbols;
    cells.forEach((cell, index) => {
        if (board[index] === "X") cell.textContent = currentSymbols.X;
        else if (board[index] === "O") cell.textContent = currentSymbols.O;
    });
    if (!isGameActive) {
        if (board.every(cell => cell !== "") && !checkWin()) statusMessage.textContent = "It's a Draw! 🤝";
        else {
            const winnerMarker = board.includes("X") && checkWinForPlayer("X") ? "X" : "O";
            statusMessage.textContent = `${currentSymbols[winnerMarker]} Wins! 🎉`;
        }
    } else { updateStatusDisplay(); }
}

pvpBtn.addEventListener('click', () => toggleModeLayout(false));
aiBtn.addEventListener('click', () => toggleModeLayout(true));

function toggleModeLayout(aiActive) {
    isAiMode = aiActive;
    pvpBtn.classList.toggle('active', !aiActive);
    aiBtn.classList.toggle('active', aiActive);
    
    difficultyGroup.style.display = aiActive ? 'flex' : 'none';
    
    resetMatchHistory();
    restartGame();
}

pickXBtn.addEventListener('click', () => selectUserSide("X"));
pickOBtn.addEventListener('click', () => selectUserSide("O"));

function selectUserSide(side) {
    if(userSide === side) return;
    userSide = side;
    pickXBtn.classList.toggle('active', side === "X");
    pickOBtn.classList.toggle('active', side === "O");
    resetMatchHistory();
    restartGame();
}

diffButtons.forEach(button => {
    button.addEventListener('click', () => {
        diffButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentDifficulty = button.getAttribute('data-diff');
        restartGame();
    });
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function handleCellClick(e) {
    const clickedCell = e.target;
    const index = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (board[index] !== "" || !isGameActive) return;
    if (isAiMode && currentPlayer !== userSide) return;

    makeMove(clickedCell, index);

    if (isGameActive && isAiMode && currentPlayer !== userSide) {
        boardElement.style.pointerEvents = 'none'; 
        setTimeout(executeAiStrategy, 400); 
    }
}

function makeMove(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer === "X" ? currentSymbols.X : currentSymbols.O;
    cell.classList.add(currentPlayer === "X" ? "marker-x" : "marker-o");

    if (checkWin()) {
        scores[currentPlayer]++;
        updateScoresDisplay();
        endGame(`${currentSymbols[currentPlayer]} Wins! 🎉`);
        highlightWinners();
        return;
    }

    if (board.every(item => item !== "")) {
        scores.draws++;
        updateScoresDisplay();
        endGame("It's a Draw! 🤝");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatusDisplay();
}

function executeAiStrategy() {
    if (!isGameActive) return;
    const aiSide = userSide === "X" ? "O" : "X";
    let optimalIndex = -1;

    if (currentDifficulty === "easy") {
        optimalIndex = getRandomMove();
    } 
    else if (currentDifficulty === "normal") {
        if (Math.random() < 0.5) {
            optimalIndex = findStrategicCell(aiSide) || findStrategicCell(userSide) || getRandomMove();
        } else {
            optimalIndex = getRandomMove();
        }
    } 
    else if (currentDifficulty === "hard") {
        optimalIndex = findStrategicCell(aiSide); 
        if (optimalIndex === -1) optimalIndex = findStrategicCell(userSide); 
        if (optimalIndex === -1) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = aiSide;
                    let score = minimax(board, 0, false, aiSide, userSide);
                    board[i] = "";
                    if (score > bestScore) {
                        bestScore = score;
                        optimalIndex = i;
                    }
                }
            }
        }
    }

    const targetCell = document.querySelector(`[data-cell-index="${optimalIndex}"]`);
    boardElement.style.pointerEvents = 'auto'; 
    makeMove(targetCell, optimalIndex);
}

function minimax(tempBoard, depth, isMaximizing, aiPlayer, humanPlayer) {
    if (checkWinForPlayer(aiPlayer)) return 10 - depth;
    if (checkWinForPlayer(humanPlayer)) return depth - 10;
    if (tempBoard.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (tempBoard[i] === "") {
                tempBoard[i] = aiPlayer;
                let score = minimax(tempBoard, depth + 1, false, aiPlayer, humanPlayer);
                tempBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (tempBoard[i] === "") {
                tempBoard[i] = humanPlayer;
                let score = minimax(tempBoard, depth + 1, true, aiPlayer, humanPlayer);
                tempBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function findStrategicCell(player) {
    for (let combo of WINNING_COMBINATIONS) {
        const values = combo.map(idx => board[idx]);
        if (values.filter(val => val === player).length === 2 && values.filter(val => val === "").length === 1) {
            return combo[values.indexOf("")];
        }
    }
    return -1;
}

function getRandomMove() {
    const emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

/* GENERAL STATUS SYSTEM UTILITIES */
function checkWin() { return WINNING_COMBINATIONS.some(combo => combo.every(idx => board[idx] === currentPlayer)); }
function checkWinForPlayer(player) { return WINNING_COMBINATIONS.some(combo => combo.every(idx => board[idx] === player)); }

function updateStatusDisplay() {
    if (!isGameActive) return;
    const activeLabel = currentPlayer === "X" ? currentSymbols.X : currentSymbols.O;
    if(isAiMode) {
        statusMessage.textContent = currentPlayer === userSide ? "Your Turn! ✨" : "AI is thinking... 🤖";
    } else {
        statusMessage.textContent = `Player ${activeLabel}'s turn`;
    }
}

function highlightWinners() {
    WINNING_COMBINATIONS.forEach(combo => {
        if (combo.every(idx => board[idx] === currentPlayer)) {
            combo.forEach(idx => cells[idx].classList.add('winner'));
        }
    });
}

function updateScoresDisplay() { statX.textContent = scores.X; statDraws.textContent = scores.draws; statO.textContent = scores.O; }
function resetMatchHistory() { scores = { X: 0, draws: 0, O: 0 }; updateScoresDisplay(); }

function endGame(msg) { statusMessage.textContent = msg; isGameActive = false; boardElement.style.pointerEvents = 'auto'; }

restartBtn.addEventListener('click', restartGame);
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X"; 
    isGameActive = true;
    updateStatusDisplay();
    boardElement.style.pointerEvents = 'auto';
    cells.forEach(cell => { cell.textContent = ""; cell.className = "cell"; });

    if (isAiMode && userSide === "O") {
        boardElement.style.pointerEvents = 'none';
        setTimeout(executeAiStrategy, 400);
    }
}