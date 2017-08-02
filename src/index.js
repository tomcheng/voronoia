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

canvas.render();
