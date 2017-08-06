import { Canvas } from "@thomascheng/canvas-utils";
import Board from "./models/Board";

const rootEl = document.getElementById("root");
const touchEl = document.getElementById("touch");
const winEl = document.getElementById("win");
const playAgainEl = document.getElementById("play-again");

const handleWin = () => {
  canvas.render();
  winEl.className = "";
  winEl.style.backgroundColor = "rgba(4,172,8,0.4)";
  winEl.style.display = "block";
  requestAnimationFrame(() => {
    winEl.className = "active";
  });
};

const canvas = new Canvas(rootEl);
let board = new Board({
  width: window.innerWidth,
  height: window.innerHeight,
  onWin: handleWin
});

playAgainEl.addEventListener("click", () => {
  winEl.style.display = "none";

  canvas.remove(board);
  board = new Board({
    width: window.innerWidth,
    height: window.innerHeight,
    onWin: handleWin
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
