import { Canvas, Circle } from "@thomascheng/canvas-utils";

const rootEl = document.getElementById("root");

const canvas = new Canvas(rootEl);

canvas.add(new Circle({
  x: 100,
  y: 100,
  radius: 3,
  fill: "#000"
}));

canvas.render();
