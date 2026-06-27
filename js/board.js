/**
 * board.js
 * Board creation and token rendering for the Ludo game.
 */

/* ───── Board Creation ───── */

function createBoard() {
    const board = document.getElementById('ludoBoard');
    board.innerHTML = '';

    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // ── Home yard quadrants ──
            if (row < 6 && col < 6) {
                cell.classList.add('home-red');
                if (BASE_POSITIONS.red.some(p => p.row === row && p.col === col)) {
                    addBaseCircle(cell, 'red');
                }
            } else if (row < 6 && col > 8) {
                cell.classList.add('home-green');
                if (BASE_POSITIONS.green.some(p => p.row === row && p.col === col)) {
                    addBaseCircle(cell, 'green');
                }
            } else if (row > 8 && col > 8) {
                cell.classList.add('home-yellow');
                if (BASE_POSITIONS.yellow.some(p => p.row === row && p.col === col)) {
                    addBaseCircle(cell, 'yellow');
                }
            } else if (row > 8 && col < 6) {
                cell.classList.add('home-blue');
                if (BASE_POSITIONS.blue.some(p => p.row === row && p.col === col)) {
                    addBaseCircle(cell, 'blue');
                }
            }

            // ── Center 3×3 zone ──
            else if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
                if (row === 7 && col === 7) {
                    cell.classList.add('center');
                    cell.textContent = '🏠';
                }
                // Home stretch cells inside 3×3 get path colors
                else if (row === 7 && col === 6) cell.classList.add('path-red');
                else if (row === 6 && col === 7) cell.classList.add('path-green');
                else if (row === 7 && col === 8) cell.classList.add('path-yellow');
                else if (row === 8 && col === 7) cell.classList.add('path-blue');
            }

            // ── Colored home-stretch corridors ──
            else if (row === 7 && col >= 1 && col <= 5)  cell.classList.add('path-red');
            else if (col === 7 && row >= 1 && row <= 5)  cell.classList.add('path-green');
            else if (row === 7 && col >= 9 && col <= 13) cell.classList.add('path-yellow');
            else if (col === 7 && row >= 9 && row <= 13) cell.classList.add('path-blue');

            // ── Safe spots ──
            if (isSafeSpot(row, col)) {
                cell.classList.add('safe');
            }

            // ── Colored starting cells ──
            if (row === 6 && col === 1)  cell.classList.add('start-red');
            if (row === 1 && col === 8)  cell.classList.add('start-green');
            if (row === 8 && col === 13) cell.classList.add('start-yellow');
            if (row === 13 && col === 6) cell.classList.add('start-blue');

            board.appendChild(cell);
        }
    }

    renderTokens();
}

/** Adds a colored decorative circle inside a base yard cell. */
function addBaseCircle(cell, color) {
    const circle = document.createElement('div');
    circle.className = `base-circle base-${color}`;
    cell.appendChild(circle);
}

/* ───── Token Rendering ───── */

function renderTokens() {
    // Remove all existing token elements
    document.querySelectorAll('.token').forEach(t => t.remove());

    players.forEach((player, pIdx) => {
        player.tokens.forEach((token, tIdx) => {
            if (token.finished) return;

            const tokenEl = document.createElement('div');
            tokenEl.className = `token token-${player.color}`;
            tokenEl.dataset.player = pIdx;
            tokenEl.dataset.token  = tIdx;
            tokenEl.title = `${player.name} token ${tIdx + 1}`;

            // Show token number
            tokenEl.textContent = tIdx + 1;

            // Determine target cell
            let targetCell;
            if (token.inHome) {
                const hp = getHomePosition(player.color, tIdx);
                targetCell = document.querySelector(`[data-row="${hp.row}"][data-col="${hp.col}"]`);
            } else {
                const pos = getTokenPosition(player.color, token.position);
                targetCell = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
            }

            if (!targetCell) return;

            // Selectable highlighting
            if (canMoveToken(pIdx, tIdx) && diceValue > 0 && !canRoll) {
                tokenEl.classList.add('selectable');
                tokenEl.addEventListener('click', e => {
                    e.stopPropagation();
                    selectAndMoveToken(pIdx, tIdx);
                });
            }

            targetCell.appendChild(tokenEl);
        });
    });
}
