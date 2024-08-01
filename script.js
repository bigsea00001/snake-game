const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score-value');
const highScoreElement = document.getElementById('high-score-value');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

const gridSize = 20;
const tileCount = 20;
canvas.width = canvas.height = gridSize * tileCount;

let snake, food, dx, dy, score, highScore, gameInterval;

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
document.addEventListener('keydown', changeDirection);

function startGame() {
    snake = [{ x: 10, y: 10 }];
    food = getRandomFood();
    dx = 0;
    dy = 0;
    score = 0;
    highScore = localStorage.getItem('highScore') || 0;
    updateScore();
    updateHighScore();
    gameOverScreen.classList.add('hidden');
    startButton.classList.add('hidden');
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function getRandomFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function gameLoop() {
    if (hasGameEnded()) {
        endGame();
        return;
    }

    clearCanvas();
    moveSnake();
    drawFood();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        food = getRandomFood();
    } else {
        snake.pop();
    }
}

function drawFood() {
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * gridSize, (food.y + 0.5) * gridSize, gridSize / 2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawSnake() {
    ctx.fillStyle = '#2ecc71';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw snake head
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            // Draw eyes
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect((segment.x * gridSize) + 3, (segment.y * gridSize) + 3, 4, 4);
            ctx.fillRect((segment.x * gridSize) + 13, (segment.y * gridSize) + 3, 4, 4);
        } else {
            // Draw snake body
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }
    });
}

function hasGameEnded() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function endGame() {
    clearInterval(gameInterval);
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        updateHighScore();
    }
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateHighScore() {
    highScoreElement.textContent = highScore;
}
