import Voronoi from "voronoi/rhill-voronoi-core";
import find from "lodash/find";
import Dot from "./Dot";
import random from "lodash/random";
import { linesAreCollinear } from "../utils/geometry"

const THRESHOLD = 15;
const NUM_DOTS = 7;
const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

class Board {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
    this.voronoi = new Voronoi();
    this.touchSelected = {};
    this.mouseSelected = [];
    this.dots = this._generateRandomDots(NUM_DOTS);
    this.virtualDots = this._generateRandomDots(NUM_DOTS);
  }

  _generateRandomDots = num => {
    const dots = [];
    for (let i = 0; i < num; i++) {
      dots.push(
        new Dot({
          x: random(THRESHOLD, this.width - THRESHOLD),
          y: random(THRESHOLD, this.height - THRESHOLD)
        })
      );
    }
    return dots;
  };

  handleMouseDown = ({ x, y }) => {
    const selected = find(
      this.dots,
      dot => distance(dot, { x, y }) < THRESHOLD
    );

    if (!selected) {
      return;
    }

    this.mouseSelected.push({
      startX: selected.x,
      startY: selected.y,
      dot: selected
    });

    this.startX = x;
    this.startY = y;
    this.moved = false;
    this.mouseDown = true;
  };

  handleMouseMove = ({ x, y }) => {
    if (!this.mouseSelected.length || !this.mouseDown) {
      return;
    }

    if (distance({ x, y }, { x: this.startX, y: this.startY }) > THRESHOLD) {
      this.moved = true;
    }

    this.mouseSelected.forEach(({ startX, startY, dot }) => {
      dot.x = startX + x - this.startX;
      dot.y = startY + y - this.startY;
    });
  };

  handleMouseUp = () => {
    this.mouseDown = false;
    if (this.moved) {
      this.mouseSelected = [];
    }
  };

  handleTouchStart = touches => {
    touches.forEach(({ x, y, id }) => {
      this.touchSelected[id] = find(
        this.dots,
        dot => distance(dot, { x, y }) < THRESHOLD
      );
    });
  };

  handleTouchMove = touches => {
    touches.forEach(({ x, y, id }) => {
      if (this.touchSelected[id]) {
        this.touchSelected[id].x = x;
        this.touchSelected[id].y = y;
      }
    });
  };

  handleTouchEnd = touches => {
    touches.forEach(({ id }) => {
      if (this.touchSelected[id]) {
        this.touchSelected[id] = null;
      }
    });
  };

  render = context => {
    const box = { xl: 0, xr: this.width, yt: 0, yb: this.height };
    const diagram = this.voronoi.compute(this.dots, box);
    const virtualDiagram = this.voronoi.compute(this.virtualDots, box);
    const edges = diagram.edges.filter(e => e.lSite && e.rSite);
    const virtualEdges = virtualDiagram.edges.filter(e => e.lSite && e.rSite);

    edges.forEach(edge => {
      const { va, vb } = edge;

      const matches = virtualEdges.some(e => linesAreCollinear(e, edge));

      context.beginPath();
      context.moveTo(va.x, va.y);
      context.lineTo(vb.x, vb.y);
      context.lineWidth = 1;
      context.strokeStyle = matches ? "red" : "#000";
      context.stroke();
    });

    virtualEdges.forEach(edge => {
      const { va, vb } = edge;

      context.beginPath();
      context.moveTo(va.x, va.y);
      context.lineTo(vb.x, vb.y);
      context.lineWidth = 1;
      context.strokeStyle = "#aaa";
      context.stroke();
    });

    this.dots.forEach(dot => {
      dot.render(context);
    });
  };
}

export default Board;
