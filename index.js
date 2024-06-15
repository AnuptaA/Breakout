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
const SHADE_BLOCKS = 20;
const colors = [
  "#FFC0CB", // pink
  "#EE4B2B", // red
  "#FFAC1C", // orange
  "#FFEA00", // yellow
  "#228B22", // green
  "#3F00FF", // indigo
  "#7F00FF", // violet
  "#40e0d0", // turquoise
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
      const block = {
        x: j * block_width,
        y: i * block_height,
        color: colors[i],
      };
      blocks.push(block);
    }
  }
  paddle = { x: (width - paddle_width) / 2, y: height - 2 * block_height };
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
  ctx.strokeStyle = color;
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = color;
  for (let j = SHADE_BLOCKS / 2 - 1; j >= 0; j--) {
    ctx.globalAlpha = 0.65 + (j + 1) / (2 * SHADE_BLOCKS);
    ctx.fillRect(
      x + (j * block_width) / SHADE_BLOCKS,
      y,
      block_width / SHADE_BLOCKS,
      block_height
    );
    ctx.fillRect(
      x + ((SHADE_BLOCKS - 1 - j) * block_width) / SHADE_BLOCKS,
      y,
      block_width / SHADE_BLOCKS,
      block_height
    );
  }

  ctx.globalAlpha = 1;
  ctx.strokeRect(x, y, w, h);
  ctx.lineWidth = 1;
}

function drawBlocks() {
  ctx.lineWidth = 2;
  for (let i = 0; i < blocks.length; i++) {
    drawRect(
      blocks[i].x,
      blocks[i].y,
      block_width,
      block_height,
      blocks[i].color
    );
  }
}

function drawPaddle() {
  ctx.fillStyle = PADDLE_COLOR;
  ctx.strokeStyle = CANVAS_COLOR;

  ctx.fillRect(paddle.x, paddle.y, paddle_width, paddle_height);
  ctx.strokeRect(paddle.x, paddle.y, paddle_width, paddle_height);
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
      ball.x > block.x &&
      ball.x < block.x + block_width &&
      ball.y > block.y &&
      ball.y < block.y + block_height
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
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle_width &&
    (ball.y == paddle.y || ball.y == paddle.y + paddle_height)
  ) {
    dy = -dy;
  }
  if (
    (ball.x + RADIUS == paddle.x ||
      ball.x - RADIUS == paddle.x + paddle_width) &&
    ball.y + RADIUS > paddle.y
  ) {
    dx = -dx;
  }
  drawBorders();
}

function drawBorders() {
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;

  /* paddle borders */
  ctx.moveTo(paddle.x, paddle.y);
  ctx.lineTo(paddle.x + paddle_width, paddle.y);
  ctx.moveTo(paddle.x, paddle.y);
  ctx.lineTo(paddle.x, paddle.y + paddle_height);
  ctx.moveTo(paddle.x + paddle_width, paddle.y + paddle_height);
  ctx.lineTo(paddle.x + paddle_width, paddle.y);
  ctx.moveTo(paddle.x + paddle_width, paddle.y + paddle_height);
  ctx.lineTo(paddle.x, paddle.y + paddle_height);
  ctx.stroke();

  /* ball positions */
  ctx.beginPath();
  ctx.strokeRect(ball.x, ball.y, 1, 1);
  ctx.strokeRect(ball.x, ball.y, 1, 1);
  ctx.strokeRect(ball.x, ball.y, 1, 1);
  ctx.strokeRect(ball.x, ball.y, 1, 1);

  ctx.stroke();
}

function moveBall() {
  changeDir();
  ball = { x: ball.x + dx, y: ball.y + dy };
}

function main() {
  init();
}
/* apply functions */
document.addEventListener("mousemove", (event) => {
  const canvasRect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - canvasRect.left;
  if (mouseX - paddle_width / 2 < 0) {
    paddle.x = 0;
  } else if (mouseX + paddle_width / 2 > width) {
    paddle.x = width - paddle_width;
  } else {
    paddle.x = mouseX - paddle_width / 2;
  }
});
main();
