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

touchEl.addEventListener("click", evt => {
  board.handleClick({ x: evt.clientX, y: evt.clientY });
  canvas.render();
});

canvas.render();
