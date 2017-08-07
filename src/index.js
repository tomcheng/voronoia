import { Canvas } from "@thomascheng/canvas-utils";
import Board from "./models/Board";
import { getRandomColor, toRGBA } from "./utils/colors";

const rootEl = document.getElementById("root");
const touchEl = document.getElementById("touch");
const winEl = document.getElementById("win");
const scoreEl = document.getElementById("score");
const playAgainEl = document.getElementById("play-again");
let primaryColor = getRandomColor();

const handleWin = () => {
  canvas.render();
  winEl.className = "";
  winEl.style.backgroundColor = toRGBA(primaryColor, 0.4);
  winEl.style.display = "block";
  scoreEl.style.display = "none";
  setTimeout(() => {
    winEl.className = "active";
  }, 1);
};

const handleUpdateScore = newScore => {
  scoreEl.innerHTML = newScore;
};

const canvas = new Canvas(rootEl);

scoreEl.style.color = toRGBA(primaryColor, 1);

let board = new Board({
  width: window.innerWidth,
  height: window.innerHeight,
  color: primaryColor,
  onWin: handleWin,
  onUpdateScore: handleUpdateScore
});

playAgainEl.addEventListener("click", () => {
  winEl.style.display = "none";

  canvas.remove(board);
  primaryColor = getRandomColor();
  scoreEl.style.color = toRGBA(primaryColor, 1);
  scoreEl.style.display = "block";
  board = new Board({
    width: window.innerWidth,
    height: window.innerHeight,
    color: primaryColor,
    onWin: handleWin,
    onUpdateScore: handleUpdateScore
  });
  canvas.add(board);
  canvas.render();
});

canvas.add(board);

touchEl.addEventListener("mousedown", evt => {
  board.handleMouseDown({ x: evt.clientX, y: evt.clientY });
});

touchEl.addEventListener("mousemove", evt => {
  board.handleMouseMove({ x: evt.clientX, y: evt.clientY });
  canvas.render();
});

touchEl.addEventListener("mouseup", () => {
  board.handleMouseUp();
});

touchEl.addEventListener("touchstart", evt => {
  evt.preventDefault();
  board.handleMouseDown({
    x: evt.touches[0].clientX,
    y: evt.touches[0].clientY
  });
});

touchEl.addEventListener("touchmove", evt => {
  evt.preventDefault();
  board.handleMouseMove({
    x: evt.touches[0].clientX,
    y: evt.touches[0].clientY
  });
  canvas.render();
});

touchEl.addEventListener("touchend", evt => {
  evt.preventDefault();
  board.handleMouseUp();
  canvas.render();
});

canvas.render();