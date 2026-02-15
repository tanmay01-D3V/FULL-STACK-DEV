const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snake = 20;
let snakePosition = [{ x: 200, y: 200 }];
let snakeSpeed = 200;
let snakeDirection = "RIGHT";
let score = 0;

let food = {
    x: Math.floor(Math.random() * canvas.width / snake) * snake,
    y: Math.floor(Math.random() * canvas.height / snake) * snake
};

document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
    if (event.key === "ArrowUp" && snakeDirection !== "DOWN") {
        snakeDirection = "UP";
    } else if (event.key === "ArrowDown" && snakeDirection !== "UP") {
        snakeDirection = "DOWN";
    } else if (event.key === "ArrowLeft" && snakeDirection !== "RIGHT") {
        snakeDirection = "LEFT";
    } else if (event.key === "ArrowRight" && snakeDirection !== "LEFT") {
        snakeDirection = "RIGHT";
    }
}

function update() {
    const head = { x: snakePosition[0].x, y: snakePosition[0].y };
    if (snakeDirection === "UP") {
        head.y -= snake;
    } else if (snakeDirection === "DOWN") {
        head.y += snake;
    } else if (snakeDirection === "LEFT") {
        head.x -= snake;
    } else if (snakeDirection === "RIGHT") {
        head.x += snake;
    }
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return gameOver();
    }

    for (let i = 1; i < snakePosition.length; i++) {
        if (head.x === snakePosition[i].x && head.y === snakePosition[i].y) {
            return gameOver();
        }
    }

    snakePosition.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("Score").innerText = `Score : ${score}`;
        generateFood();
    } else {
        snakePosition.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / snake)) * snake;
    food.y = Math.floor(Math.random() * (canvas.height / snake)) * snake;

    // Ensure food doesn't spawn on snake
    for (let segment of snakePosition) {
        if (food.x === segment.x && food.y === segment.y) {
            generateFood();
            break;
        }
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snakePosition.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#4CAF50" : "#81C784"; // head is darker green
        ctx.strokeStyle = "black";
        ctx.fillRect(segment.x, segment.y, snake, snake);
        ctx.strokeRect(segment.x, segment.y, snake, snake);
    });

    // Draw food
    ctx.fillStyle = "#FF5252";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#FF5252";
    ctx.fillRect(food.x, food.y, snake, snake);
    ctx.shadowBlur = 0; // reset shadow
}

function gameOver() {
    clearInterval(gameInterval);
    document.getElementById("gameOverOverlay").classList.remove("hidden");
    document.getElementById("finalScore").innerText = `Your score: ${score}`;
}

function startGame() {
    document.getElementById("startOverlay").classList.add("hidden");
    resetVariables();
    gameInterval = setInterval(gameLoop, snakeSpeed);
}

function resetGame() {
    document.getElementById("gameOverOverlay").classList.add("hidden");
    resetVariables();
    gameInterval = setInterval(gameLoop, snakeSpeed);
}

function resetVariables() {
    score = 0;
    document.getElementById("Score").innerText = `Score : ${score}`;
    snakePosition = [{ x: 200, y: 200 }];
    snakeDirection = "RIGHT";
    generateFood();
    draw();
}

function gameLoop() {
    update();
    draw();
}

let gameInterval;
// Initial draw to show something before start
draw();


