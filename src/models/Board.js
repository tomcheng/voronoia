import Voronoi from "voronoi/rhill-voronoi-core";
import find from "lodash/find";
import { Rectangle } from "@thomascheng/canvas-utils";
import Dot from "./Dot";
import random from "lodash/random";
import clamp from "lodash/clamp";
import min from "lodash/min";
import { toRGBA } from "../utils/colors";

const SELECT_THRESHOLD = 20;
const FINE_TUNE_CONSTANT = 0.25;
const TAP_TIME_THRESHOLD = 300;
const TAP_DISTANCE_THRESHOLD = 3;
const VERTEX_THRESHOLD = 5;
const VIRTUAL_EDGE_COLOR = "rgba(0,0,0,0.1)";

const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

class Board {
  constructor({ width, height, color, onWin, onUpdateScore }) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.onWin = onWin;
    this.onUpdateScore = onUpdateScore;
    this.voronoi = new Voronoi();
    this.selectedDot = null;
    this.background = new Rectangle({
      x: 0,
      y: 0,
      width,
      height,
      fill: toRGBA(this.color, 0.1)
    });

    const numDots = random(6, 10);

    this.dots = this._generateRandomDots(numDots);
    this.virtualDots = this._generateRandomDots(numDots);

    const box = { xl: 0, xr: this.width, yt: 0, yb: this.height };
    const diagram = this.voronoi.compute(this.dots, box);
    const virtualDiagram = this.voronoi.compute(this.virtualDots, box);

    this.virtualEdges = virtualDiagram.edges.filter(e => e.lSite && e.rSite);
    this.virtualVertices = virtualDiagram.vertices;
    this.edges = diagram.edges.filter(e => e.lSite && e.rSite);
    this.vertices = diagram.vertices;
    this.matchedVertices = [];
    this.matchedEdges = [];
    this.directMove = false;
    this.won = false;

    this._updateScore();
  }

  _generateRandomDots = num => {
    const dots = [];
    for (let i = 0; i < num; i++) {
      dots.push(
        new Dot({
          x: random(SELECT_THRESHOLD, this.width - SELECT_THRESHOLD),
          y: random(SELECT_THRESHOLD, this.height - SELECT_THRESHOLD),
          color: toRGBA(this.color, 1)
        })
      );
    }
    return dots;
  };

  _updateEdgesAndVertices = () => {
    const box = { xl: 0, xr: this.width, yt: 0, yb: this.height };
    const diagram = this.voronoi.compute(this.dots, box);
    this.edges = diagram.edges.filter(e => e.lSite && e.rSite);
    this.vertices = diagram.vertices;
    this.matchedVertices = diagram.vertices.filter(vertex =>
      this.virtualVertices.some(v => distance(v, vertex) < VERTEX_THRESHOLD)
    );
    this.matchedEdges = this.edges.filter(({ va, vb }) =>
      this.matchedVertices.includes(va) && this.matchedVertices.includes(vb)
    );
  };

  _updateScore = () => {
    this.onUpdateScore(
      `${this.matchedEdges.length}/${this.virtualEdges.length}`
    );
  };

  _selectDot = dot => {
    if (this.selectedDot) {
      this.selectedDot.selected = false;
    }

    dot.selected = true;
    this.selectedDot = dot;
  };

  _checkWin = () => this.edges.length === this.matchedEdges.length;

  handleMouseDown = ({ x, y }) => {
    this.mouseDownTime = new Date().getTime();
    const selected = find(
      this.dots,
      dot => distance(dot, { x, y }) < SELECT_THRESHOLD
    );

    if (selected) {
      this._selectDot(selected);
    }

    if (!this.selectedDot) {
      return;
    }

    this.mouseStart = { x, y };

    if (selected) {
      this.directMove = true;
    } else {
      this.selectedStart = { x: this.selectedDot.x, y: this.selectedDot.y };
      this.directMove = false;
    }
  };

  handleMouseMove = ({ x, y }) => {
    if (!this.selectedDot) {
      return;
    }

    const tapThresholdMet =
      new Date().getTime() - this.mouseDownTime > TAP_TIME_THRESHOLD;
    const tapDistanceThresholdMet =
      distance(this.mouseStart, { x, y }) > TAP_DISTANCE_THRESHOLD;

    if (this.directMove && !tapThresholdMet && !tapDistanceThresholdMet) {
      return;
    }

    if (this.directMove) {
      this.selectedDot.x = x;
      this.selectedDot.y = y;
    } else {
      this.selectedDot.x = clamp(
        this.selectedStart.x + FINE_TUNE_CONSTANT * (x - this.mouseStart.x),
        0,
        this.width
      );
      this.selectedDot.y = clamp(
        this.selectedStart.y + FINE_TUNE_CONSTANT * (y - this.mouseStart.y),
        0,
        this.height
      );
    }

    this._updateEdgesAndVertices();
    this._updateScore();
  };

  handleMouseUp = () => {
    if (this._checkWin()) {
      if (this.selectedDot) {
        this.selectedDot.selected = false;
        this.selectedDot = null;
      }
      this.won = true;
      this.onWin();
    }
  };

  render = context => {
    this.background.render(context);

    if (!this.won) {
      this.virtualEdges.forEach(edge => {
        const { va, vb } = edge;

        context.beginPath();
        context.moveTo(va.x, va.y);
        context.lineTo(vb.x, vb.y);
        context.lineWidth = 1;
        context.strokeStyle = VIRTUAL_EDGE_COLOR;
        context.stroke();
      });

      this.vertices.forEach(vertex => {
        const distances = this.virtualVertices.map(v => distance(v, vertex));
        const minDistance = min(distances);

        if (minDistance < 100) {
          const opacity =
            minDistance < VERTEX_THRESHOLD ? 1 : (100 - minDistance) / 400;
          const radius =
            minDistance < VERTEX_THRESHOLD ? 3 : (minDistance - 5) * 1.3 + 3;
          context.beginPath();
          context.arc(vertex.x, vertex.y, radius, 0, 2 * Math.PI);
          context.fillStyle = toRGBA(this.color, opacity);
          context.fill();
        }
      });
    }

    this.edges.forEach(edge => {
      const { va, vb } = edge;

      const isMatched = this.matchedEdges.includes(edge);

      context.beginPath();
      context.moveTo(va.x, va.y);
      context.lineTo(vb.x, vb.y);
      context.lineWidth = isMatched && !this.won ? 1.5 : 1;
      context.strokeStyle = isMatched
        ? toRGBA(this.color, 1)
        : toRGBA(this.color, 0.5);
      context.stroke();
    });

    this.dots.forEach(dot => {
      dot.render(context);
    });
  };
}

export default Board;
