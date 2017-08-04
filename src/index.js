import { Canvas } from "@thomascheng/canvas-utils";
import Board from "./models/Board";

const rootEl = document.getElementById("root");
const touchEl = document.getElementById("touch");

const canvas = new Canvas(rootEl);
const board = new Board({
  width: window.innerWidth,
  height: window.innerHeight
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
  board.handleMouseDown({ x: evt.touches[0].clientX, y: evt.touches[0].clientY });
});

touchEl.addEventListener("touchmove", evt => {
  evt.preventDefault();
  board.handleMouseMove({ x: evt.touches[0].clientX, y: evt.touches[0].clientY });
  canvas.render();
});

touchEl.addEventListener("touchend", evt => {
  evt.preventDefault();
  board.handleMouseUp();
  canvas.render();
});

canvas.render();
