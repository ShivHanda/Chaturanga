// script.js
let game;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Chaturanga...");
    game = new GameState();
    initUI();
    render();
});

function initUI() {
    const rollBtn = document.getElementById('roll-btn');
    const diceContainer = document.getElementById('dice-container');

    rollBtn.addEventListener('click', () => {
        diceContainer.classList.add('rolling');
        rollBtn.disabled = true;

        setTimeout(() => {
            game.rollDice();
            diceContainer.classList.remove('rolling');
            render();
        }, 500);
    });

    // Help Modal Logic
    const modal = document.getElementById('help-modal');
    const helpBtn = document.getElementById('help-btn');
    const closeBtn = document.querySelector('.close-btn');

    helpBtn.addEventListener('click', () => {
        modal.classList.add('show');
        // Populate Legend Icons if empty
        if (!document.querySelector('#legend-king div')) {
            populateLegend();
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    const board = document.getElementById('game-board');
    board.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            sq.dataset.r = r;
            sq.dataset.c = c;
            sq.onclick = () => handleSquareClick(r, c);
            board.appendChild(sq);
        }
    }
}

function handleSquareClick(r, c) {
    if (!game) return;
    game.selectSquare(r, c);
    render();
}

function render() {
    if (!game) return;

    // Victory Check
    if (game.winner) {
        const vModal = document.getElementById('victory-modal');
        const vMsg = document.getElementById('victory-message');
        vMsg.textContent = game.winner.text;
        vMsg.className = game.winner.class;
        vModal.classList.add('show');
    } else {
        document.getElementById('victory-modal').classList.remove('show');
    }

    // Render Board Pieces
    const squares = document.querySelectorAll('.square');
    squares.forEach(sq => {
        const r = parseInt(sq.dataset.r);
        const c = parseInt(sq.dataset.c);
        const piece = game.board[r][c];

        // Reset classes
        sq.classList.remove('selected', 'valid-move');

        // Highlight Selected
        if (game.selectedSquare && game.selectedSquare.r === r && game.selectedSquare.c === c) {
            sq.classList.add('selected');
        }

        // Highlight Valid Moves
        if (game.validMoves.some(m => m.r === r && m.c === c)) {
            sq.classList.add('valid-move');
        }

        sq.innerHTML = '';
        if (piece) {
            const el = document.createElement('div');
            el.className = `piece piece-${piece.color}`;
            el.innerHTML = Assets.getSVG(piece.type);
            sq.appendChild(el);
        }
    });

    // UI Info
    const msgBox = document.getElementById('message-box');
    if (msgBox) msgBox.textContent = game.message;

    const diceVal = document.getElementById('dice-value');
    if (diceVal) diceVal.textContent = game.diceValue || '-';

    // Update Sidebar Active Player
    const pIds = {
        [COLORS.YELLOW]: 'player-yellow',
        [COLORS.GREEN]: 'player-green',
        [COLORS.BLACK]: 'player-black',
        [COLORS.RED]: 'player-red'
    };

    game.players.forEach((player, index) => {
        const elId = pIds[player.color];
        const el = document.getElementById(elId);
        if (!el) return;

        const statusEl = el.querySelector('.status');
        el.classList.remove('active');

        if (index === game.currentTurn && !game.winner) {
            el.classList.add('active');
            statusEl.textContent = "PLAYING";
            statusEl.style.color = "#fff";
            statusEl.style.fontWeight = "bold";
        } else {
            if (player.isFrozen) {
                statusEl.textContent = "FROZEN";
                statusEl.style.color = "#ff4444";
            } else {
                statusEl.textContent = "Waiting";
                statusEl.style.color = "#aaa";
                statusEl.style.fontWeight = "normal";
            }
        }
    });


    // Dice Button State
    const rollBtn = document.getElementById('roll-btn');
    if (rollBtn) rollBtn.disabled = (game.diceValue !== null || !!game.winner);
}

document.getElementById('reset-btn').addEventListener('click', () => {
    game.resetGame();
    render();
});

function populateLegend() {
    const list = [
        { id: 'legend-king', type: PIECES.KING, color: COLORS.YELLOW },
        { id: 'legend-elephant', type: PIECES.ELEPHANT, color: COLORS.BLACK },
        { id: 'legend-horse', type: PIECES.HORSE, color: COLORS.RED },
        { id: 'legend-boat', type: PIECES.BOAT, color: COLORS.GREEN },
        { id: 'legend-pawn', type: PIECES.PAWN, color: COLORS.YELLOW }
    ];

    list.forEach(item => {
        const container = document.getElementById(item.id);
        const div = document.createElement('div');
        div.className = `piece piece-${item.color}`;
        div.innerHTML = Assets.getSVG(item.type);
        container.insertBefore(div, container.firstChild);
    });
}
