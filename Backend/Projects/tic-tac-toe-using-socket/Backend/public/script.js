const socket = io();

// --- DOM Elements ---
const connectionStatus = document.getElementById('connection-status');
const loginScreen = document.getElementById('login-screen');
const waitingScreen = document.getElementById('waiting-screen');
const gameScreen = document.getElementById('game-screen');
const winnerModal = document.getElementById('winner-modal');

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const loginError = document.getElementById('login-error');

const waitingInfo = document.getElementById('waiting-info');
const activePlayers = document.getElementById('active-players');

const playerXEl = document.getElementById('player-x');
const playerOEl = document.getElementById('player-o');
const turnIndicator = document.getElementById('turn-indicator');
const boardEl = document.getElementById('board');
const cells = document.querySelectorAll('.cell');

const winnerIcon = document.getElementById('winner-icon');
const winnerText = document.getElementById('winner-text');
const winnerDetail = document.getElementById('winner-detail');
const playAgainBtn = document.getElementById('play-again-btn');

const historyList = document.getElementById('history-list');

let mySymbol = null;
let myUsername = null;

// --- Connection Status ---
socket.on('connect', () => {
  connectionStatus.textContent = 'Connected';
  connectionStatus.className = 'status-badge connected';
});

socket.on('disconnect', () => {
  connectionStatus.textContent = 'Disconnected';
  connectionStatus.className = 'status-badge disconnected';
});

// --- Login ---
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (!username) {
    loginError.textContent = 'Please enter a username';
    return;
  }
  loginError.textContent = '';
  socket.emit('user-login', { username });
});

socket.on('login-success', ({ symbol, username }) => {
  mySymbol = symbol;
  myUsername = username;
  loginScreen.classList.add('hidden');
  waitingScreen.classList.remove('hidden');
  waitingInfo.textContent = `You are playing as ${symbol}`;
});

socket.on('login-error', ({ message }) => {
  loginError.textContent = message;
});

// --- Players Update ---
socket.on('players-update', ({ players }) => {
  activePlayers.innerHTML = players
    .map((p) => `<span class="player-chip ${p.symbol.toLowerCase()}">${p.username} (${p.symbol})</span>`)
    .join('');
});

// --- Game Start ---
socket.on('game-start', ({ board, currentTurn }) => {
  waitingScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  resetBoardUI();
  renderBoard(board);
  updateTurnIndicator(currentTurn);
  updatePlayerTags(currentTurn);
  loadHistory();
});

// --- Move Made ---
socket.on('move-made', ({ index, symbol, board, nextTurn }) => {
  renderBoard(board);
  updateTurnIndicator(nextTurn);
  updatePlayerTags(nextTurn);
});

// --- Game Over ---
socket.on('game-over', ({ winner, winningLine, isDraw, totalMoves, reason }) => {
  // Disable board
  cells.forEach((cell) => cell.classList.add('disabled'));

  // Highlight winning line
  if (winningLine) {
    winningLine.forEach((idx) => {
      cells[idx].classList.add('winning');
    });
  }

  // Show modal
  setTimeout(() => {
    if (isDraw) {
      winnerIcon.textContent = '🤝';
      winnerText.textContent = "It's a Draw!";
      winnerDetail.textContent = `Game ended in ${totalMoves} moves`;
    } else if (reason === 'opponent-left') {
      winnerIcon.textContent = '🏃';
      winnerText.textContent = 'Opponent Left!';
      const opponentName = winner === mySymbol ? myUsername : 'Opponent';
      winnerDetail.textContent = `${opponentName} wins by forfeit`;
    } else {
      const isMe = winner === mySymbol;
      winnerIcon.textContent = isMe ? '🏆' : '😔';
      winnerText.textContent = isMe ? 'You Win!' : 'You Lose!';
      winnerDetail.textContent = `${winner} won in ${totalMoves} moves`;
    }
    winnerModal.classList.remove('hidden');
  }, 600);

  loadHistory();
});

// --- Game Reset ---
socket.on('game-reset', () => {
  winnerModal.classList.add('hidden');
  gameScreen.classList.add('hidden');
  waitingScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  mySymbol = null;
  myUsername = null;
  usernameInput.value = '';
  resetBoardUI();
  loadHistory();
});

// --- Play Again ---
playAgainBtn.addEventListener('click', () => {
  socket.emit('reset-game');
});

// --- Board Click ---
boardEl.addEventListener('click', (e) => {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const index = parseInt(cell.dataset.index, 10);
  if (isNaN(index)) return;
  socket.emit('make-move', { index });
});

// --- UI Helpers ---
function renderBoard(board) {
  cells.forEach((cell, i) => {
    const val = board[i];
    cell.textContent = val || '';
    cell.className = 'cell';
    if (val === 'X') cell.classList.add('x');
    else if (val === 'O') cell.classList.add('o');
  });
}

function resetBoardUI() {
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.className = 'cell';
  });
}

function updateTurnIndicator(currentTurn) {
  turnIndicator.textContent = `${currentTurn}'s Turn`;
}

function updatePlayerTags(currentTurn) {
  playerXEl.className = 'player-tag tag-x' + (currentTurn === 'X' ? ' active-turn' : '');
  playerOEl.className = 'player-tag tag-o' + (currentTurn === 'O' ? ' active-turn' : '');
  playerXEl.textContent = 'X';
  playerOEl.textContent = 'O';
}

// --- History ---
async function loadHistory() {
  try {
    const res = await fetch('/api/history');
    const data = await res.json();
    if (!data.length) {
      historyList.innerHTML = '<p class="history-empty">No games played yet</p>';
      return;
    }
    historyList.innerHTML = data
      .map((g) => {
        const date = new Date(g.played_at).toLocaleString();
        let resultClass = 'draw';
        let resultText = 'Draw';
        if (g.winner === 'X') {
          resultClass = 'win-x';
          resultText = `${g.player_x} (X) wins`;
        } else if (g.winner === 'O') {
          resultClass = 'win-o';
          resultText = `${g.player_o} (O) wins`;
        }
        return `<div class="history-item">
          <span class="result ${resultClass}">${resultText}</span>
          <span class="date">${date}</span>
        </div>`;
      })
      .join('');
  } catch (err) {
    // Silent fail — history is non-critical
  }
}

// Load history on page load
loadHistory();
