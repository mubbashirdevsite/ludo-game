/**
 * game.js
 * Core Ludo game logic: state management, move validation, capture, win detection.
 */

/* ───── Game State ───── */
let numPlayers   = 4;
let currentPlayer = 0;
let diceValue    = 0;
let canRoll      = true;
let players      = [];

/* ───── Helpers ───── */

/**
 * Returns the board coordinates of a token given its color and step position.
 * position -1  → not yet on board (inHome)
 * position 0–51 → main path
 * position 52–57 → colored home-stretch
 * position 57   → finished (center)
 */
function getTokenPosition(color, position) {
    if (position < 0) return { row: -1, col: -1 };

    if (position >= 52) {
        const homeIdx = position - 52;
        if (homeIdx < HOME_PATHS[color].length) {
            return HOME_PATHS[color][homeIdx];
        }
        return { row: 7, col: 7 }; // Center — finished
    }

    const pathIdx = (START_INDEX[color] + position) % 52;
    return MAIN_PATH[pathIdx];
}

/** Returns base-yard position for a token in home. */
function getHomePosition(color, tokenIndex) {
    return BASE_POSITIONS[color][tokenIndex];
}

/* ───── Initialization ───── */

function initializePlayers() {
    players = [];
    for (let i = 0; i < numPlayers; i++) {
        players.push({
            color:         COLORS[i],
            name:          COLOR_NAMES[i],
            tokens: [
                { id: 0, position: -1, inHome: true, finished: false },
                { id: 1, position: -1, inHome: true, finished: false },
                { id: 2, position: -1, inHome: true, finished: false },
                { id: 3, position: -1, inHome: true, finished: false }
            ],
            finishedCount: 0
        });
    }
}

/* ───── Move Validation ───── */

/**
 * Returns true if a token can be moved with the current dice value.
 * Rules:
 *  - Only current player's tokens.
 *  - Finished tokens cannot move.
 *  - Token in home yard needs a 6 to come out.
 *  - Moving past the final cell (57) is not allowed.
 */
function canMoveToken(playerIndex, tokenIndex) {
    if (playerIndex !== currentPlayer) return false;

    const token = players[playerIndex].tokens[tokenIndex];
    if (token.finished) return false;
    if (token.inHome && diceValue !== 6) return false;

    // FIX: correct finish boundary is 57 (52 main + 5 home-stretch steps)
    if (!token.inHome && token.position + diceValue > 57) return false;

    return true;
}

/* ───── Move Execution ───── */

function selectAndMoveToken(playerIndex, tokenIndex) {
    const player = players[playerIndex];
    const token  = player.tokens[tokenIndex];

    if (token.inHome) {
        // Come out of home yard to starting cell
        token.inHome    = false;
        token.position  = 0;
    } else {
        token.position += diceValue;

        // Check finished
        if (token.position >= 57) {
            token.position  = 57;
            token.finished  = true;
            player.finishedCount++;

            showMessage(`🎉 ${player.name}'s token reached home!`);

            if (player.finishedCount === 4) {
                endGame(player.name);
                return;
            }
        }
    }

    // Capture check (only if on main path)
    if (!token.finished) {
        checkCapture(playerIndex, tokenIndex);
    }

    renderTokens();
    updateUI();

    if (diceValue === 6) {
        canRoll  = true;
        diceValue = 0;
        showMessage(`${PLAYER_EMOJIS[player.color]} ${player.name} ne 6 dala! Phir se roll karo!`);
    } else {
        diceValue = 0;
        setTimeout(nextPlayer, 1000);
    }
}

/* ───── Capture ───── */

function checkCapture(playerIndex, tokenIndex) {
    const player  = players[playerIndex];
    const token   = player.tokens[tokenIndex];
    const pos     = getTokenPosition(player.color, token.position);

    // No capture on safe spots or home-stretch
    if (isSafeSpot(pos.row, pos.col)) return;
    if (token.position >= 52) return;

    players.forEach((opponent, opIdx) => {
        if (opIdx === playerIndex) return;

        opponent.tokens.forEach(opToken => {
            if (opToken.inHome || opToken.finished) return;
            if (opToken.position >= 52) return; // in home stretch — safe

            const opPos = getTokenPosition(opponent.color, opToken.position);
            if (opPos.row === pos.row && opPos.col === pos.col) {
                // Captured!
                opToken.inHome   = true;
                opToken.position = -1;
                showMessage(`💥 ${player.name} ne ${opponent.name} ka token capture kiya!`);
            }
        });
    });
}

/* ───── Turn Management ───── */

function rollDice() {
    if (!canRoll) return;

    const diceEl = document.getElementById('dice');
    diceEl.classList.add('rolling', 'disabled');
    canRoll = false;

    setTimeout(() => {
        diceValue = Math.floor(Math.random() * 6) + 1;
        diceEl.textContent = DICE_FACES[diceValue];
        diceEl.classList.remove('rolling', 'disabled');

        const player = players[currentPlayer];
        const hasMovable = player.tokens.some((_, i) => canMoveToken(currentPlayer, i));

        if (!hasMovable) {
            if (diceValue === 6) {
                showMessage(`${PLAYER_EMOJIS[player.color]} ${player.name} — koi move nahi, phir se roll karo!`);
                canRoll = true;
            } else {
                showMessage(`${PLAYER_EMOJIS[player.color]} ${player.name} — koi move nahi! Agla player...`);
                setTimeout(nextPlayer, 1500);
            }
        } else {
            showMessage(`🎲 ${diceValue} dala! Token select karo.`);
            renderTokens();
        }
    }, 500);
}

function nextPlayer() {
    currentPlayer = (currentPlayer + 1) % numPlayers;
    canRoll  = true;
    diceValue = 0;
    updateUI();
    renderTokens();
}

/* ───── Win ───── */

function endGame(winnerName) {
    document.getElementById('winnerText').textContent = `🎉 ${winnerName} Jeet Gaya! 🎉`;
    showScreen('endScreen');
}
