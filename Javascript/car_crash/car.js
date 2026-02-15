const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreLabel = document.getElementById("score");
const startOverlay = document.getElementById("startOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScore = document.getElementById("finalScore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const road = {
  width: canvas.width,
  height: canvas.height,
  lineHeight: 40,
  lineWidth: 8,
  lineGap: 26,
  scrollSpeed: 4,
  lineOffset: 0,
};

const player = {
  x: canvas.width / 2 - 18,
  y: canvas.height - 72,
  w: 36,
  h: 58,
  speed: 5,
};

let enemies = [];
let score = 0;
let animationId = null;
let running = false;
let spawnTick = 0;
let spawnEvery = 55;

const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};

function randomEnemy() {
  const width = 36;
  const x = 20 + Math.random() * (canvas.width - 40 - width);
  return {
    x,
    y: -80,
    w: width,
    h: 58,
    speed: 2.8 + Math.random() * 2.4,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 58%)`,
  };
}

function drawRoad() {
  ctx.fillStyle = "#24355a";
  ctx.fillRect(0, 0, road.width, road.height);

  road.lineOffset = (road.lineOffset + road.scrollSpeed) % (road.lineHeight + road.lineGap);

  ctx.fillStyle = "#f8f9fb";
  const centerX = canvas.width / 2 - road.lineWidth / 2;
  for (let y = -road.lineHeight; y < canvas.height + road.lineHeight; y += road.lineHeight + road.lineGap) {
    ctx.fillRect(centerX, y + road.lineOffset, road.lineWidth, road.lineHeight);
  }
}

function drawCar(car, color) {
  ctx.fillStyle = color;
  ctx.fillRect(car.x, car.y, car.w, car.h);

  ctx.fillStyle = "#111826";
  ctx.fillRect(car.x + 6, car.y + 10, car.w - 12, 14);
  ctx.fillRect(car.x + 6, car.y + 32, car.w - 12, 12);

  ctx.fillStyle = "#ffcf56";
  ctx.fillRect(car.x + 2, car.y + 3, 6, 4);
  ctx.fillRect(car.x + car.w - 8, car.y + 3, 6, 4);
}

function updatePlayer() {
  if (keys.ArrowLeft) player.x -= player.speed;
  if (keys.ArrowRight) player.x += player.speed;
  if (keys.ArrowUp) player.y -= player.speed * 0.7;
  if (keys.ArrowDown) player.y += player.speed * 0.7;

  const minX = 8;
  const maxX = canvas.width - player.w - 8;
  const minY = canvas.height - 180;
  const maxY = canvas.height - player.h - 10;

  if (player.x < minX) player.x = minX;
  if (player.x > maxX) player.x = maxX;
  if (player.y < minY) player.y = minY;
  if (player.y > maxY) player.y = maxY;
}

function updateEnemies() {
  spawnTick += 1;
  if (spawnTick >= spawnEvery) {
    spawnTick = 0;
    enemies.push(randomEnemy());
    if (spawnEvery > 32) spawnEvery -= 0.5;
  }

  enemies.forEach((enemy) => {
    enemy.y += enemy.speed + road.scrollSpeed * 0.45;
  });

  const remaining = [];
  for (const enemy of enemies) {
    if (enemy.y > canvas.height + 80) {
      score += 1;
      scoreLabel.textContent = `Score: ${score}`;
      continue;
    }
    remaining.push(enemy);
  }
  enemies = remaining;
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function checkCollision() {
  for (const enemy of enemies) {
    if (isColliding(player, enemy)) {
      endGame();
      return;
    }
  }
}

function draw() {
  drawRoad();
  drawCar(player, "#4ef18d");
  enemies.forEach((enemy) => drawCar(enemy, enemy.color));
}

function loop() {
  if (!running) return;
  updatePlayer();
  updateEnemies();
  checkCollision();
  draw();
  animationId = requestAnimationFrame(loop);
}

function resetState() {
  player.x = canvas.width / 2 - 18;
  player.y = canvas.height - 72;
  enemies = [];
  score = 0;
  spawnTick = 0;
  spawnEvery = 55;
  scoreLabel.textContent = "Score: 0";
}

function startGame() {
  resetState();
  running = true;
  startOverlay.classList.add("hidden");
  gameOverOverlay.classList.add("hidden");
  loop();
}

function endGame() {
  running = false;
  cancelAnimationFrame(animationId);
  finalScore.textContent = `Score: ${score}`;
  gameOverOverlay.classList.remove("hidden");
}

document.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
    event.preventDefault();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key in keys) keys[event.key] = false;
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

draw();
