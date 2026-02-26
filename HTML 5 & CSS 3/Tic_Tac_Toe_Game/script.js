const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const el = {
  firstPlayer: document.getElementById("firstPlayer"),
  status: document.getElementById("status"),
  board: document.getElementById("board"),
  cells: Array.from(document.querySelectorAll(".cell")),
  resetScores: document.getElementById("resetScores"),
  scoreX: document.getElementById("scoreX"),
  scoreO: document.getElementById("scoreO"),
  scoreD: document.getElementById("scoreD"),
};

let board = Array(9).fill(null);
let current = "X";
let gameOver = false;
let scores = { X: 0, O: 0, D: 0 };
let nextRoundTimer = null;

function otherPlayer(p) {
  return p === "X" ? "O" : "X";
}

function getWinner(b) {
  for (const line of WIN_LINES) {
    const [a, c, d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      return { winner: b[a], line };
    }
  }
  return { winner: null, line: null };
}

function isDraw(b) {
  return b.every((v) => v) && !getWinner(b).winner;
}

function setStatus(text) {
  el.status.textContent = text;
}

function clearNextRoundTimer() {
  if (nextRoundTimer !== null) {
    window.clearTimeout(nextRoundTimer);
    nextRoundTimer = null;
  }
}

function scheduleNextRound() {
  clearNextRoundTimer();
  nextRoundTimer = window.setTimeout(() => {
    newRound();
  }, 1500);
}

function render() {
  const { winner, line } = getWinner(board);

  for (const cell of el.cells) {
    const i = Number(cell.dataset.i);
    const v = board[i];
    cell.textContent = v ?? "";
    cell.classList.toggle("cell--win", Boolean(line && line.includes(i)));
    cell.disabled = gameOver || Boolean(v);
    cell.setAttribute("aria-label", `Cell ${i + 1}${v ? `: ${v}` : ""}`);
  }

  if (winner) {
    setStatus(`${winner} wins! Next round starting...`);
  } else if (isDraw(board)) {
    setStatus("Draw. Next round starting...");
  } else {
    setStatus(`Turn: ${current}`);
  }

  el.scoreX.textContent = String(scores.X);
  el.scoreO.textContent = String(scores.O);
  el.scoreD.textContent = String(scores.D);
}

function endIfNeeded() {
  const { winner } = getWinner(board);
  if (winner) {
    gameOver = true;
    scores[winner] += 1;
    render();
    scheduleNextRound();
    return true;
  }
  if (isDraw(board)) {
    gameOver = true;
    scores.D += 1;
    render();
    scheduleNextRound();
    return true;
  }
  return false;
}

function applyMove(i, p) {
  if (gameOver) return false;
  if (board[i]) return false;
  board[i] = p;
  if (endIfNeeded()) return true;
  current = otherPlayer(current);
  render();
  return true;
}

function newRound() {
  clearNextRoundTimer();
  board = Array(9).fill(null);
  current = el.firstPlayer.value;
  gameOver = false;
  render();
}

function resetScores() {
  clearNextRoundTimer();
  scores = { X: 0, O: 0, D: 0 };
  newRound();
}

el.board.addEventListener("click", (e) => {
  const btn = e.target.closest("button.cell");
  if (!btn) return;
  const i = Number(btn.dataset.i);
  applyMove(i, current);
});

el.resetScores.addEventListener("click", resetScores);
el.firstPlayer.addEventListener("change", newRound);

newRound();
