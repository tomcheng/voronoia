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
  board.handleTouchStart(
    Array.from(evt.changedTouches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier
    }))
  );
});

touchEl.addEventListener("touchmove", evt => {
  evt.preventDefault();
  board.handleTouchMove(
    Array.from(evt.changedTouches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier
    }))
  );
  canvas.render();
});

touchEl.addEventListener("touchend", evt => {
  evt.preventDefault();
  board.handleTouchEnd(
    Array.from(evt.changedTouches).map(touch => ({ id: touch.identifier }))
  );
});

canvas.render();
