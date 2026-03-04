// src/constants.js
const COLORS = {
    YELLOW: 'yellow',
    BLACK: 'black',
    RED: 'red',
    GREEN: 'green'
};

const PIECES = {
    KING: 'King',
    ELEPHANT: 'Elephant',
    HORSE: 'Horse',
    BOAT: 'Boat',
    PAWN: 'Pawn'
};

const RANKS = {
    [PIECES.KING]: 2,
    [PIECES.ELEPHANT]: 2,
    [PIECES.HORSE]: 2,
    [PIECES.BOAT]: 1,
    [PIECES.PAWN]: 1
};

const PLAYERS = [
    { id: 0, color: COLORS.YELLOW, team: 0, name: 'Yellow', forward: { r: -1, c: 0 }, startZone: 'bottom-left' },
    { id: 1, color: COLORS.GREEN, team: 1, name: 'Green', forward: { r: 0, c: -1 }, startZone: 'bottom-right' },
    { id: 2, color: COLORS.BLACK, team: 0, name: 'Black', forward: { r: 1, c: 0 }, startZone: 'top-right' },
    { id: 3, color: COLORS.RED, team: 1, name: 'Red', forward: { r: 0, c: 1 }, startZone: 'top-left' }
];
