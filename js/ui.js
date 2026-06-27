/**
 * ui.js
 * UI helpers: screen switching, player info panel, message box, scoreboard.
 */

/* ───── Screen Management ───── */

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showStart() {
    showScreen('startScreen');
}

/* ───── Game Entry Point ───── */

function startGame(playerCount) {
    numPlayers    = playerCount;
    currentPlayer = 0;
    diceValue     = 0;
    canRoll       = true;

    // Reset dice display
    document.getElementById('dice').textContent = '🎲';

    initializePlayers();
    createBoard();
    updateUI();
    showScreen('gameScreen');
}

/* ───── Player Info Panel ───── */

function updateUI() {
    const container = document.getElementById('playersInfo');
    container.innerHTML = '';

    players.forEach((player, idx) => {
        const card = document.createElement('div');
        card.className = 'player-info';
        if (idx === currentPlayer) card.classList.add('active');

        const allHome = player.tokens.every(t => t.inHome);
        const onBoard = player.tokens.filter(t => !t.inHome && !t.finished).length;

        card.innerHTML = `
            <h3>${PLAYER_EMOJIS[player.color]} ${player.name}</h3>
            <p>🏁 Finish: ${player.finishedCount}/4</p>
            <p>🎯 Board: ${onBoard}</p>
        `;
        container.appendChild(card);
    });

    const current = players[currentPlayer];
    const hint = canRoll
        ? `${PLAYER_EMOJIS[current.color]} ${current.name} ki baari — Dice roll karo!`
        : `${PLAYER_EMOJIS[current.color]} ${current.name} — Token select karo!`;
    showMessage(hint);

    // Dice disabled style
    const diceEl = document.getElementById('dice');
    if (canRoll) {
        diceEl.classList.remove('disabled');
    } else {
        diceEl.classList.add('disabled');
    }
}

/* ───── Message Box ───── */

function showMessage(msg) {
    document.getElementById('messageBox').textContent = msg;
}

/* ───── End Screen ───── */

function showWinner(name) {
    document.getElementById('winnerText').textContent = `🎉 ${name} Jeet Gaya! 🎉`;

    // Build final scoreboard
    const tbody = document.getElementById('scoreTbody');
    tbody.innerHTML = '';

    // Sort by finishedCount desc
    const sorted = [...players].sort((a, b) => b.finishedCount - a.finishedCount);
    sorted.forEach((p, rank) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${rank + 1}</td>
            <td>${PLAYER_EMOJIS[p.color]} ${p.name}</td>
            <td>${p.finishedCount}/4</td>
        `;
        tbody.appendChild(tr);
    });

    showScreen('endScreen');
}
