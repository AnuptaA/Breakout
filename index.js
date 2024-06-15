/* constants */
const canvas = document.getElementById("br_canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const ORIGIN = 0;
const NUM_BLOCKS = 12;
const NUM_ROWS = 8;
const RADIUS = 10;
const CANVAS_COLOR = "#333333";
const PADDLE_COLOR = "#A0A0A0";
const colors = [
  "#FFC0CB",
  "#EE4B2B",
  "#FFAC1C",
  "#FFEA00",
  "#AAFF00",
  "#3F00FF",
  "#7F00FF",
  "#40e0d0",
];

/* variables */
var block_width;
var block_height;
var blocks;

var paddle;
var paddle_width;
var ball;

var dx;
var dy;

var timeInterval;

/* function definitions */
function init() {
  blocks = [];
  block_width = width / NUM_BLOCKS;
  block_height = (height * 0.4) / NUM_ROWS;
  paddle_width = 1.5 * block_width;
  paddle_height = 0.5 * block_height;

  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_BLOCKS; j++) {
      const block = { x: j * block_width, y: i * block_height, color: colors[i]};
      blocks.push(block);
    }
  }
  paddle = { x: (width - paddle_width) / 2, y: height - 3 * block_height };
  ball = { x: width / 2, y: paddle.y - RADIUS };

  dx = RADIUS / 2;
  dy = -RADIUS / 2;

  timeInterval = setInterval(drawGame, 5);
}

function clearCanvas() {
  ctx.fillStyle = CANVAS_COLOR;
  ctx.strokeStyle = "black";

  ctx.fillRect(ORIGIN, ORIGIN, width, height);
  ctx.strokeRect(ORIGIN, ORIGIN, width, height);
}

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = CANVAS_COLOR;

  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
}

function drawBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    drawRect(blocks[i].x, blocks[i].y, block_width, block_height, blocks[i].color);
  }
}

function drawPaddle() {
  drawRect(paddle.x, paddle.y, paddle_width, paddle_height, PADDLE_COLOR);
}

function drawBall() {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.strokeStyle = PADDLE_COLOR;

  ctx.arc(ball.x, ball.y, RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  moveBall();
}

function drawGame() {
  clearCanvas();
  drawBlocks();
  drawPaddle();
  drawBall();
}

function changeDir() {
  // Check wall collisions
  if (ball.x + RADIUS > width || ball.x - RADIUS < 0) dx = -dx;
  if (ball.y - RADIUS < 0) dy = -dy;
  if (ball.y + RADIUS > height) clearInterval(timeInterval); // Game over condition

  // Check block collisions
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (
      ball.x + RADIUS > block.x &&
      ball.x - RADIUS < block.x + block_width &&
      ball.y + RADIUS > block.y &&
      ball.y - RADIUS < block.y + block_height
    ) {
      // Determine the collision side
      if (ball.x > block.x && ball.x < block.x + block_width) {
        dy = -dy;
      } else {
        dx = -dx;
      }
      blocks.splice(i, 1);
      break;
    }
  }

  // Check paddle collision
  if (
    ball.x + RADIUS > paddle.x &&
    ball.x - RADIUS < paddle.x + paddle_width &&
    ball.y + RADIUS > paddle.y &&
    ball.y - RADIUS < paddle.y + paddle_height
  ) {
    dy = -dy;
  }
}

function moveBall() {
  changeDir();
  ball = { x: ball.x + dx, y: ball.y + dy };
}

function main() {
    init();
}
/* apply functions */
document.addEventListener("mousemove", event => {
    if (event.clientX <= 0) paddle.x = 0;
    else if (event.clientX >= width) paddle.y = width - paddle_width;
    else paddle.x = event.clientX - paddle_width / 2;
});
main();
