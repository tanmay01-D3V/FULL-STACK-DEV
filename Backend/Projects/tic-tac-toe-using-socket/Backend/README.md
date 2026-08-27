# Tic Tac Toe — Real-Time Multiplayer

A real-time multiplayer Tic Tac Toe game built with **Node.js**, **Express**, **Socket.io**, and **Supabase** (Postgres). Two players connect via browser, get assigned X or O, and play a fully server-authoritative game. Finished games are persisted to a Supabase database.

## Database Choice

**Supabase** — Postgres via hosted dashboard with minimal setup. Requires a free Supabase project.

## Setup

### 1. Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com) project (free tier works)

### 2. Create the database table

In your Supabase SQL Editor, run:

```sql
CREATE TABLE game_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_x TEXT NOT NULL,
  player_o TEXT NOT NULL,
  winner TEXT NOT NULL,
  total_moves INTEGER NOT NULL,
  played_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in `SUPABASE_URL` and `SUPABASE_KEY` from your Supabase project settings (Settings > API).

### 4. Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in two browser tabs.

## Socket Event Reference

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `user-login` | client → server | `{ username }` | Request to join |
| `login-success` | server → client | `{ symbol, username }` | Login accepted |
| `login-error` | server → client | `{ message }` | Login rejected |
| `players-update` | server → all | `{ players[] }` | Live player list |
| `game-start` | server → all | `{ board, currentTurn }` | Game begins (2 players joined) |
| `make-move` | client → server | `{ index }` | Player attempts a move |
| `move-made` | server → all | `{ index, symbol, board, nextTurn }` | Broadcast applied move |
| `game-over` | server → all | `{ winner, winningLine, isDraw, totalMoves }` | Game concluded |
| `reset-game` | client → server | `{}` | Request a reset |
| `game-reset` | server → all | `{}` | Room cleared, return to login |
| `disconnect` | client → server (built-in) | — | Cleanup on leave |

## Features

- Real-time multiplayer via Socket.io
- Username login with X/O symbol assignment
- 2-player room limit with rejection for 3rd player
- Server-authoritative game logic (no client-side win checking)
- All 8 win patterns detected (3 rows, 3 columns, 2 diagonals)
- Draw detection
- Winning line highlight with animation
- Winner/Draw/Disconnect modal
- Game history persisted to Supabase
- Responsive mobile-first UI
- Connection status indicator
- Graceful disconnect handling

## API

- `GET /api/history` — Returns last 20 games from the database

## Project Structure

```
Backend/
├── server.js          # Express + Socket.io server, game logic, DB integration
├── package.json
├── .env               # Supabase credentials (git-ignored)
├── .env.example       # Template for .env
├── public/
│   ├── index.html     # Login, game board, modal, history UI
│   ├── style.css      # Responsive dark theme with animations
│   └── script.js      # Socket client, DOM rendering, event wiring
└── README.md
```
