require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.static('public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('[DB] Supabase client initialized');
} else {
  console.warn('[DB] Supabase credentials not set — game history will not be persisted');
}

let players = {};
let board = Array(9).fill(null);
let currentTurn = 'X';
let gameActive = false;
let totalMoves = 0;

// --- Constants ---
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

// --- Helper: check winner ---
function checkWinner(b) {
  for (const line of WIN_LINES) {
    const [a, c, d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      return { winner: b[a], winningLine: line };
    }
  }
  return null;
}

// --- Helper: reset room ---
function resetRoom() {
  players = {};
  board = Array(9).fill(null);
  currentTurn = 'X';
  gameActive = false;
  totalMoves = 0;
}

// --- Persist game to Supabase ---
async function persistGame(playerX, playerO, winner, moves) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('game_history').insert({
      player_x: playerX,
      player_o: playerO,
      winner: winner,
      total_moves: moves,
      played_at: new Date().toISOString(),
    });
    if (error) {
      console.error('[DB] Insert error:', error.message);
    } else {
      console.log('[DB] Game saved');
    }
  } catch (err) {
    console.error('[DB] Unexpected error:', err.message);
  }
}

// --- REST: get game history ---
app.get('/api/history', async (req, res) => {
  if (!supabase) {
    return res.json([]);
  }
  try {
    const { data, error } = await supabase
      .from('game_history')
      .select('*')
      .order('played_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('[DB] History fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// --- Socket.io Connection Handling ---
io.on('connection', (socket) => {
  console.log(`[SOCKET] Connected: ${socket.id}`);

  // --- Phase 2: Login ---
  socket.on('user-login', ({ username }) => {
    const trimmed = (username || '').trim();

    // Validate: empty username
    if (!trimmed) {
      socket.emit('login-error', { message: 'Username cannot be empty' });
      return;
    }

    // Validate: duplicate username
    const nameTaken = Object.values(players).some(
      (p) => p.username.toLowerCase() === trimmed.toLowerCase()
    );
    if (nameTaken) {
      socket.emit('login-error', { message: 'Username already taken' });
      return;
    }

    // Validate: room full
    const playerCount = Object.keys(players).length;
    if (playerCount >= 2) {
      socket.emit('login-error', { message: 'Room is full — only 2 players allowed' });
      return;
    }

    // Assign symbol
    const symbol = playerCount === 0 ? 'X' : 'O';
    players[socket.id] = { username: trimmed, symbol };

    socket.emit('login-success', { symbol, username: trimmed });

    // Broadcast updated player list
    const playerList = Object.values(players).map((p) => ({
      username: p.username,
      symbol: p.symbol,
    }));
    io.emit('players-update', { players: playerList });

    console.log(`[LOGIN] ${trimmed} joined as ${symbol}`);

    // Start game when 2 players are in
    if (Object.keys(players).length === 2) {
      gameActive = true;
      currentTurn = 'X';
      totalMoves = 0;
      board = Array(9).fill(null);
      io.emit('game-start', { board, currentTurn });
      console.log('[GAME] Game started');
    }
  });

  // --- Phase 3: Game Logic ---
  socket.on('make-move', ({ index }) => {
    // Ignore if not a valid move
    if (!gameActive) return;

    const player = players[socket.id];
    if (!player) return;

    // Validate turn
    if (player.symbol !== currentTurn) return;

    // Validate index
    if (index < 0 || index > 8) return;

    // Validate cell empty
    if (board[index] !== null) return;

    // Apply move
    board[index] = player.symbol;
    totalMoves++;
    currentTurn = currentTurn === 'X' ? 'O' : 'X';

    io.emit('move-made', {
      index,
      symbol: player.symbol,
      board,
      nextTurn: currentTurn,
    });

    // Check winner
    const result = checkWinner(board);
    if (result) {
      gameActive = false;
      const playerX = Object.values(players).find((p) => p.symbol === 'X')?.username || 'Unknown';
      const playerO = Object.values(players).find((p) => p.symbol === 'O')?.username || 'Unknown';

      io.emit('game-over', {
        winner: result.winner,
        winningLine: result.winningLine,
        isDraw: false,
        totalMoves,
      });

      persistGame(playerX, playerO, result.winner, totalMoves);
      console.log(`[GAME] Winner: ${result.winner}`);
      return;
    }

    // Check draw
    if (totalMoves === 9) {
      gameActive = false;
      const playerX = Object.values(players).find((p) => p.symbol === 'X')?.username || 'Unknown';
      const playerO = Object.values(players).find((p) => p.symbol === 'O')?.username || 'Unknown';

      io.emit('game-over', {
        winner: null,
        winningLine: null,
        isDraw: true,
        totalMoves,
      });

      persistGame(playerX, playerO, 'draw', totalMoves);
      console.log('[GAME] Draw');
    }
  });

  // --- Phase 4: Reset ---
  socket.on('reset-game', () => {
    resetRoom();
    io.emit('game-reset');
    console.log('[GAME] Room reset');
  });

  // --- Phase 5: Disconnect ---
  socket.on('disconnect', () => {
    const player = players[socket.id];
    if (player) {
      console.log(`[SOCKET] Disconnected: ${socket.id} (${player.username})`);

      // If game was active, notify the other player
      if (gameActive) {
        const otherPlayer = Object.values(players).find((p) => p.symbol !== player.symbol);
        io.emit('game-over', {
          winner: otherPlayer ? otherPlayer.symbol : null,
          winningLine: null,
          isDraw: false,
          totalMoves,
          reason: 'opponent-left',
        });
      }

      delete players[socket.id];

      const playerList = Object.values(players).map((p) => ({
        username: p.username,
        symbol: p.symbol,
      }));
      io.emit('players-update', { players: playerList });

      // Reset room for fresh join
      resetRoom();
      io.emit('game-reset');
      console.log('[GAME] Room reset after disconnect');
    }
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
