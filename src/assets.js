// src/assets.js
const Assets = {
    getSVG: function (type) {
        const style = `stroke-linejoin="round" stroke-linecap="round"`;

        switch (type) {
            case PIECES.KING: // Raja
                return `<svg viewBox="0 0 100 100" ${style}>
                    <path d="M30 70 L70 70 L65 40 L35 40 Z" fill="currentColor" stroke="inherit" stroke-width="3"/>
                    <circle cx="50" cy="30" r="10" fill="currentColor" stroke="inherit" stroke-width="3"/>
                    <path d="M50 20 L50 10 M40 15 L60 15" stroke="inherit" stroke-width="3"/> 
                </svg>`;
            case PIECES.ELEPHANT: // Hathi
                return `<svg viewBox="0 0 100 100" ${style}>
                    <path d="M20 70 L80 70 L80 50 Q80 20 50 20 Q20 20 20 50 Z" fill="currentColor" stroke="inherit" stroke-width="3"/>
                    <path d="M30 50 C30 60 40 60 40 50" stroke="inherit" stroke-width="3" fill="none"/> 
                    <path d="M60 50 C60 60 70 60 70 50" stroke="inherit" stroke-width="3" fill="none"/>
                    <path d="M50 50 L50 70" stroke="inherit" stroke-width="4"/>
                </svg>`;
            case PIECES.HORSE: // Ghoda
                return `<svg viewBox="0 0 100 100" ${style}>
                    <path d="M30 80 L70 80 L65 50 L75 30 L55 10 L35 30 L40 50 L30 80" fill="currentColor" stroke="inherit" stroke-width="3"/>
                    <circle cx="55" cy="25" r="3" fill="#fff"/>
                </svg>`;
            case PIECES.BOAT: // Nauka
                return `<svg viewBox="0 0 100 100" ${style}>
                    <path d="M20 60 Q50 90 80 60 L75 50 L25 50 Z" fill="currentColor" stroke="inherit" stroke-width="3"/>
                    <path d="M50 50 L50 15 L75 40 Z" fill="currentColor" stroke="inherit" stroke-width="3"/>
                </svg>`;
            case PIECES.PAWN: // Sainik
                return `<svg viewBox="0 0 100 100" ${style}>
                    <path d="M30 80 L70 80 L60 40 L40 40 Z" fill="currentColor" stroke="inherit" stroke-width="3"/>
                    <circle cx="50" cy="30" r="12" fill="currentColor" stroke="inherit" stroke-width="3"/>
                </svg>`;
            default:
                return '';
        }
    }
};
