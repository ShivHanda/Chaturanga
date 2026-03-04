// src/game.js

class GameState {
    constructor() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.players = PLAYERS.map(p => ({
            ...p,
            isFrozen: false,
            capturedKings: 0,
            activeKings: 1,
            isEliminated: false
        }));
        this.currentTurn = 0; // Index in PLAYERS
        this.diceValue = null; // 2, 3, 4, 5
        this.selectedSquare = null;
        this.validMoves = [];
        this.message = "Welcome! Roll the Pasha to start.";

        this.initBoard();
    }

    initBoard() {
        // Place Pieces
        this.placePiece(7, 0, COLORS.YELLOW, PIECES.BOAT);
        this.placePiece(7, 1, COLORS.YELLOW, PIECES.HORSE);
        this.placePiece(7, 2, COLORS.YELLOW, PIECES.ELEPHANT);
        this.placePiece(7, 3, COLORS.YELLOW, PIECES.KING);
        for (let c = 0; c < 4; c++) this.placePiece(6, c, COLORS.YELLOW, PIECES.PAWN);

        this.placePiece(0, 7, COLORS.BLACK, PIECES.BOAT);
        this.placePiece(0, 6, COLORS.BLACK, PIECES.HORSE);
        this.placePiece(0, 5, COLORS.BLACK, PIECES.ELEPHANT);
        this.placePiece(0, 4, COLORS.BLACK, PIECES.KING);
        for (let c = 4; c < 8; c++) this.placePiece(1, c, COLORS.BLACK, PIECES.PAWN);

        this.placePiece(0, 0, COLORS.RED, PIECES.BOAT);
        this.placePiece(1, 0, COLORS.RED, PIECES.HORSE);
        this.placePiece(2, 0, COLORS.RED, PIECES.ELEPHANT);
        this.placePiece(3, 0, COLORS.RED, PIECES.KING);
        for (let r = 0; r < 4; r++) this.placePiece(r, 1, COLORS.RED, PIECES.PAWN);

        this.placePiece(7, 7, COLORS.GREEN, PIECES.BOAT);
        this.placePiece(6, 7, COLORS.GREEN, PIECES.HORSE);
        this.placePiece(5, 7, COLORS.GREEN, PIECES.ELEPHANT);
        this.placePiece(4, 7, COLORS.GREEN, PIECES.KING);
        for (let r = 4; r < 8; r++) this.placePiece(r, 6, COLORS.GREEN, PIECES.PAWN);
    }

    placePiece(r, c, color, type) {
        this.board[r][c] = { color, type };
    }

    rollDice() {
        if (this.diceValue !== null) return;
        const rolls = [2, 3, 4, 5];
        this.diceValue = rolls[Math.floor(Math.random() * rolls.length)];

        const p = this.players[this.currentTurn];
        const canMove = this.canPlayerMove(p.color, this.diceValue);

        if (!canMove) {
            this.message = `${p.name} rolled ${this.diceValue} but has no valid pieces! Skip.`;
            setTimeout(() => this.endTurn(), 2000);
        } else {
            this.message = `${p.name} rolled ${this.diceValue}. Select a piece.`;
        }
    }

    canPlayerMove(color, roll) {
        const types = [];
        if (roll === 2) types.push(PIECES.BOAT);
        if (roll === 3) types.push(PIECES.HORSE);
        if (roll === 4) types.push(PIECES.ELEPHANT);
        if (roll === 5) types.push(PIECES.KING, PIECES.PAWN);

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = this.board[r][c];
                if (p && p.color === color && types.includes(p.type)) {
                    if (this.getValidMoves(r, c).length > 0) return true;
                }
            }
        }
        return false;
    }

    selectSquare(r, c) {
        if (this.diceValue === null) return;

        const piece = this.board[r][c];
        const currentPlayer = this.players[this.currentTurn];

        if (piece && piece.color === currentPlayer.color) {
            if (!this.matchesDice(piece.type, this.diceValue)) {
                this.message = `Dice rolled ${this.diceValue}! You can only move matching pieces.`; // Feedback
                return;
            }

            this.selectedSquare = { r, c };
            this.validMoves = this.getValidMoves(r, c);
        } else if (this.selectedSquare) {
            const move = this.validMoves.find(m => m.r === r && m.c === c);
            if (move) {
                this.executeMove(this.selectedSquare, move);
            } else {
                this.selectedSquare = null;
                this.validMoves = [];
            }
        }
    }

    matchesDice(type, roll) {
        if (roll === 2 && type === PIECES.BOAT) return true;
        if (roll === 3 && type === PIECES.HORSE) return true;
        if (roll === 4 && type === PIECES.ELEPHANT) return true;
        if (roll === 5 && (type === PIECES.KING || type === PIECES.PAWN)) return true;
        return false;
    }

    getValidMoves(r, c) {
        const piece = this.board[r][c];
        if (!piece) return [];

        const moves = [];
        const player = this.players.find(p => p.color === piece.color);

        switch (piece.type) {
            case PIECES.KING:
                [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => {
                    this.addMoveIfValid(r, c, r + dr, c + dc, moves);
                });
                break;
            case PIECES.ELEPHANT:
                [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
                    let nr = r + dr, nc = c + dc;
                    while (this.isValidPos(nr, nc)) {
                        if (this.addMoveIfValid(r, c, nr, nc, moves)) {
                            if (this.board[nr][nc]) break;
                        } else {
                            break;
                        }
                        nr += dr; nc += dc;
                    }
                });
                break;
            case PIECES.HORSE:
                [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => {
                    this.addMoveIfValid(r, c, r + dr, c + dc, moves);
                });
                break;
            case PIECES.BOAT:
                [[-2, -2], [-2, 2], [2, -2], [2, 2]].forEach(([dr, dc]) => {
                    this.addMoveIfValid(r, c, r + dr, c + dc, moves);
                });
                break;
            case PIECES.PAWN:
                const fwd = player.forward;
                let nr = r + fwd.r;
                let nc = c + fwd.c;
                if (this.isValidPos(nr, nc) && !this.board[nr][nc]) {
                    moves.push({ r: nr, c: nc });
                }
                const diags = [];
                if (fwd.r !== 0) {
                    diags.push({ r: fwd.r, c: -1 });
                    diags.push({ r: fwd.r, c: 1 });
                } else {
                    diags.push({ r: -1, c: fwd.c });
                    diags.push({ r: 1, c: fwd.c });
                }

                diags.forEach(d => {
                    const tr = r + d.r;
                    const tc = c + d.c;
                    if (this.isValidPos(tr, tc) && this.board[tr][tc]) {
                        this.addMoveIfValid(r, c, tr, tc, moves);
                    }
                });
                break;
        }
        return moves;
    }

    isValidPos(r, c) {
        return r >= 0 && r < 8 && c >= 0 && c < 8;
    }

    addMoveIfValid(fromR, fromC, toR, toC, moves) {
        if (!this.isValidPos(toR, toC)) return false;

        const piece = this.board[fromR][fromC];
        const target = this.board[toR][toC];
        const player = this.players.find(p => p.color === piece.color);

        if (!target) {
            moves.push({ r: toR, c: toC });
            return true;
        }

        if (target.color === piece.color) return false;
        const targetPlayer = this.players.find(p => p.color === target.color);
        const isAlly = targetPlayer.team === player.team;

        if (target.type === PIECES.KING && isAlly) return false;

        const pieceRank = RANKS[piece.type];
        const targetRank = RANKS[target.type];

        if (pieceRank < targetRank) return false;

        moves.push({ r: toR, c: toC });
        return true;
    }

    executeMove(from, to) {
        const piece = this.board[from.r][from.c];
        const target = this.board[to.r][to.c];

        this.board[to.r][to.c] = piece;
        this.board[from.r][from.c] = null;

        if (target) {
            if (target.type === PIECES.KING) {
                this.handleKingCapture(piece.color, target);
            }
        }

        if (piece.type === PIECES.PAWN) {
            this.checkPromotion(to.r, to.c, piece);
        }

        this.endTurn();
    }

    checkPromotion(r, c, piece) {
        const player = this.players.find(p => p.color === piece.color);
        let promoted = false;

        if (player.forward.r === -1 && r === 0) promoted = true;
        if (player.forward.r === 1 && r === 7) promoted = true;
        if (player.forward.c === 1 && c === 7) promoted = true;
        if (player.forward.c === -1 && c === 0) promoted = true;

        if (promoted) {
            const fileMapping = [PIECES.BOAT, PIECES.HORSE, PIECES.ELEPHANT, PIECES.KING, PIECES.KING, PIECES.ELEPHANT, PIECES.HORSE, PIECES.BOAT];
            let index = (player.forward.r !== 0) ? c : r;
            let newType = fileMapping[index];

            if (newType === PIECES.KING) {
                player.activeKings++;
            }

            piece.type = newType;
            console.log(`Promoted to ${newType}`);
        }
    }

    handleKingCapture(attackerColor, capturedKingPiece) {
        const victimColor = capturedKingPiece.color;
        const victim = this.players.find(p => p.color === victimColor);

        victim.activeKings--;
        if (victim.activeKings <= 0) {
            victim.isFrozen = true;
            this.message = `${victim.name} is Frozen!`;
        }

        const attacker = this.players.find(p => p.color === attackerColor);
        const ally = this.players.find(p => p.team === attacker.team && p.color !== attacker.color);

        if (ally && ally.isFrozen) {
            this.reviveKing(ally);
        }

        // Check Victory after capture
        this.checkWinCondition();
    }

    checkWinCondition() {
        const team0Kings = this.players.filter(p => p.team === 0).reduce((sum, p) => sum + p.activeKings, 0);
        const team1Kings = this.players.filter(p => p.team === 1).reduce((sum, p) => sum + p.activeKings, 0);

        if (team0Kings === 0) {
            this.declareWinner(1); // Team 1 (Red/Green) Wins
        } else if (team1Kings === 0) {
            this.declareWinner(0); // Team 0 (Yellow/Black) Wins
        }
    }

    declareWinner(winningTeam) {
        let winners = "";
        let colorClass = "";

        if (winningTeam === 0) {
            winners = "YELLOW & BLACK";
            colorClass = "team-yellow-black";
        } else {
            winners = "RED & GREEN";
            colorClass = "team-red-green";
        }

        this.winner = {
            text: `${winners} TEAM WINS!`,
            team: winningTeam,
            class: colorClass
        };
        this.message = "GAME OVER!";
    }

    resetGame() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.players = PLAYERS.map(p => ({
            ...p,
            isFrozen: false,
            capturedKings: 0,
            activeKings: 1,
            isEliminated: false
        }));
        this.currentTurn = 0;
        this.diceValue = null;
        this.selectedSquare = null;
        this.validMoves = [];
        this.message = "Welcome! Roll the Pasha to start.";
        this.winner = null;

        this.initBoard();
    }

    reviveKing(player) {
        player.isFrozen = false;
        player.activeKings = 1;

        let r, c;
        if (player.color === COLORS.YELLOW) { r = 7; c = 3; }
        else if (player.color === COLORS.BLACK) { r = 0; c = 4; }
        else if (player.color === COLORS.RED) { r = 3; c = 0; }
        else if (player.color === COLORS.GREEN) { r = 4; c = 7; }

        if (!this.board[r][c]) {
            this.board[r][c] = { color: player.color, type: PIECES.KING };
        } else {
            const offsets = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            let placed = false;
            for (let o of offsets) {
                const nr = r + o[0], nc = c + o[1];
                if (this.isValidPos(nr, nc) && !this.board[nr][nc]) {
                    this.board[nr][nc] = { color: player.color, type: PIECES.KING };
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                console.log("No space to revive King!");
            }
        }
        this.message = `${player.name} has been Revived!`;
    }

    endTurn() {
        if (this.winner) return; // Stop if game over

        this.selectedSquare = null;
        this.validMoves = [];
        this.diceValue = null;

        let nextIndex = (this.currentTurn + 1) % 4;
        let loops = 0;

        while (this.players[nextIndex].isFrozen && loops < 4) {
            nextIndex = (nextIndex + 1) % 4;
            loops++;
        }

        if (loops === 4) {
            // Should be covered by checkWinCondition logic, but just in case
            this.message = "All players frozen? Draw?";
            return;
        }

        this.currentTurn = nextIndex;
    }
}
