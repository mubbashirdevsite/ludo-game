/**
 * gameData.js
 * All static game data: board paths, home positions, safe spots, player config.
 */

// Player colors & display names
const COLORS      = ['red', 'green', 'yellow', 'blue'];
const COLOR_NAMES = ['Red', 'Green', 'Yellow', 'Blue'];

// Emoji for each player
const PLAYER_EMOJIS = {
    red:    '🔴',
    green:  '🟢',
    yellow: '🟡',
    blue:   '🔵'
};

// Dice face emojis
const DICE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

/**
 * Main board path — 52 cells, clockwise starting from Red's entry.
 * Row/col are 0-indexed on a 15x15 grid.
 */
const MAIN_PATH = [
    // Red side — left column going up
    { row: 6, col: 1  }, { row: 6, col: 2  }, { row: 6, col: 3  }, { row: 6, col: 4  }, { row: 6, col: 5  },
    // Top corridor going up
    { row: 5, col: 6  }, { row: 4, col: 6  }, { row: 3, col: 6  }, { row: 2, col: 6  }, { row: 1, col: 6  }, { row: 0, col: 6  },
    // Top row
    { row: 0, col: 7  }, { row: 0, col: 8  },
    // Green side — right column going down
    { row: 1, col: 8  }, { row: 2, col: 8  }, { row: 3, col: 8  }, { row: 4, col: 8  }, { row: 5, col: 8  },
    // Right corridor going right
    { row: 6, col: 9  }, { row: 6, col: 10 }, { row: 6, col: 11 }, { row: 6, col: 12 }, { row: 6, col: 13 },
    // Right edge
    { row: 7, col: 14 }, { row: 8, col: 14 },
    // Yellow side — right column going up (from right)
    { row: 8, col: 13 }, { row: 8, col: 12 }, { row: 8, col: 11 }, { row: 8, col: 10 }, { row: 8, col: 9  },
    // Bottom corridor going down
    { row: 9, col: 8  }, { row: 10, col: 8 }, { row: 11, col: 8 }, { row: 12, col: 8 }, { row: 13, col: 8 }, { row: 14, col: 8 },
    // Bottom row
    { row: 14, col: 7 }, { row: 14, col: 6 },
    // Blue side — left column going up from bottom
    { row: 13, col: 6 }, { row: 12, col: 6 }, { row: 11, col: 6 }, { row: 10, col: 6 }, { row: 9, col: 6  },
    // Left corridor going left
    { row: 8, col: 5  }, { row: 8, col: 4  }, { row: 8, col: 3  }, { row: 8, col: 2  }, { row: 8, col: 1  },
    // Left edge (back to Red)
    { row: 7, col: 0  }, { row: 6, col: 0  }
];

/**
 * Colored home-stretch paths — 6 cells each, leading into center.
 */
const HOME_PATHS = {
    red:    [{ row: 7, col: 1 }, { row: 7, col: 2 }, { row: 7, col: 3 }, { row: 7, col: 4 }, { row: 7, col: 5 }, { row: 7, col: 6 }],
    green:  [{ row: 1, col: 7 }, { row: 2, col: 7 }, { row: 3, col: 7 }, { row: 4, col: 7 }, { row: 5, col: 7 }, { row: 6, col: 7 }],
    yellow: [{ row: 7, col: 13}, { row: 7, col: 12}, { row: 7, col: 11}, { row: 7, col: 10}, { row: 7, col: 9 }, { row: 7, col: 8 }],
    blue:   [{ row: 13, col: 7}, { row: 12, col: 7}, { row: 11, col: 7}, { row: 10, col: 7}, { row: 9, col: 7 }, { row: 8, col: 7 }]
};

/**
 * Offset in MAIN_PATH where each color enters the board.
 */
const START_INDEX = { red: 0, green: 13, yellow: 26, blue: 39 };

/**
 * Starting board cell for each color (row/col).
 */
const START_POSITIONS = {
    red:    { row: 6, col: 1  },
    green:  { row: 1, col: 8  },
    yellow: { row: 8, col: 13 },
    blue:   { row: 13, col: 6 }
};

/**
 * Token base (home yard) positions for each color — 4 tokens each.
 */
const BASE_POSITIONS = {
    red:    [{ row: 2, col: 2 }, { row: 2, col: 4 }, { row: 4, col: 2 }, { row: 4, col: 4 }],
    green:  [{ row: 2, col: 10}, { row: 2, col: 12}, { row: 4, col: 10}, { row: 4, col: 12}],
    yellow: [{ row: 10,col: 10}, { row: 10,col: 12}, { row: 12,col: 10}, { row: 12,col: 12}],
    blue:   [{ row: 10,col: 2 }, { row: 10,col: 4 }, { row: 12,col: 2 }, { row: 12,col: 4 }]
};

/**
 * Safe spots — tokens here cannot be captured.
 */
const SAFE_SPOTS = [
    { row: 6, col: 2  }, { row: 2, col: 8  }, { row: 8, col: 12 }, { row: 12, col: 6 },
    { row: 1, col: 6  }, { row: 6, col: 13 }, { row: 13, col: 8 }, { row: 8,  col: 1 }
];

/**
 * Checks whether a given cell (row, col) is a safe spot.
 * @param {number} row
 * @param {number} col
 * @returns {boolean}
 */
function isSafeSpot(row, col) {
    return SAFE_SPOTS.some(s => s.row === row && s.col === col);
}
