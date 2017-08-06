import Voronoi from "voronoi/rhill-voronoi-core";
import find from "lodash/find";
import { Rectangle } from "@thomascheng/canvas-utils";
import Dot from "./Dot";
import random from "lodash/random";
import { linesAreCollinear } from "../utils/geometry";

const SELECT_THRESHOLD = 20;
const FINE_TUNE_CONSTANT = 0.25;
const TAP_TIME_THRESHOLD = 300;
const TAP_DISTANCE_THRESHOLD = 3;
const NUM_DOTS = 10;
const BACKGROUND_COLOR = "rgba(4,172,8,0.1)";
const MATCHED_COLOR = "rgba(4,172,8,1)";
const UNMATCHED_COLOR = "rgba(4,172,8,0.5)";
const VIRTUAL_EDGE_COLOR = "rgba(0,0,0,0.1)";

const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

class Board {
  constructor({ width, height, onWin }) {
    this.width = width;
    this.height = height;
    this.onWin = onWin;
    this.voronoi = new Voronoi();
    this.selectedDot = null;
    this.dots = this._generateRandomDots(NUM_DOTS);
    this.virtualDots = this._generateRandomDots(NUM_DOTS);
    this.background = new Rectangle({ x: 0, y: 0, width, height, fill: BACKGROUND_COLOR});

    const box = { xl: 0, xr: this.width, yt: 0, yb: this.height };
    const diagram = this.voronoi.compute(this.dots, box);
    const virtualDiagram = this.voronoi.compute(this.virtualDots, box);

    this.virtualEdges = virtualDiagram.edges.filter(e => e.lSite && e.rSite);
    this.edges = diagram.edges.filter(e => e.lSite && e.rSite);
    this.matchedEdges = [];
    this.mouseDown = false;
    this.directMove = false;
  }

  _generateRandomDots = num => {
    const dots = [];
    for (let i = 0; i < num; i++) {
      dots.push(
        new Dot({
          x: random(SELECT_THRESHOLD, this.width - SELECT_THRESHOLD),
          y: random(SELECT_THRESHOLD, this.height - SELECT_THRESHOLD),
          color: MATCHED_COLOR
        })
      );
    }
    return dots;
  };

  _updateEdges = () => {
    const box = { xl: 0, xr: this.width, yt: 0, yb: this.height };
    const diagram = this.voronoi.compute(this.dots, box);
    this.edges = diagram.edges.filter(e => e.lSite && e.rSite);
  };

  _updateMatchedEdges = () => {
    this.matchedEdges = this.edges.filter(edge => this.virtualEdges.some(ve => linesAreCollinear(ve, edge)));
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
    this.mouseDown = true;
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
    if (!this.selectedDot || !this.mouseDown) {
      return;
    }

    const tapThresholdMet = new Date().getTime() - this.mouseDownTime > TAP_TIME_THRESHOLD;
    const tapDistanceThresholdMet = distance(this.mouseStart, {x, y}) > TAP_DISTANCE_THRESHOLD;

    if (this.directMove && !tapThresholdMet && !tapDistanceThresholdMet) {
      return;
    }

    if (this.directMove) {
      this.selectedDot.x = x;
      this.selectedDot.y = y;
    } else {
      this.selectedDot.x = this.selectedStart.x + FINE_TUNE_CONSTANT * (x - this.mouseStart.x);
      this.selectedDot.y = this.selectedStart.y + FINE_TUNE_CONSTANT * (y - this.mouseStart.y);
    }

    this._updateEdges();
    this._updateMatchedEdges();
  };

  handleMouseUp = () => {
    this.mouseDown = false;
    if (this._checkWin()) {
      this.onWin();
    }
  };

  render = context => {
    this.background.render(context);

    this.virtualEdges.forEach(edge => {
      const { va, vb } = edge;

      context.beginPath();
      context.moveTo(va.x, va.y);
      context.lineTo(vb.x, vb.y);
      context.lineWidth = 1;
      context.strokeStyle = VIRTUAL_EDGE_COLOR;
      context.stroke();
    });

    this.edges.forEach(edge => {
      const { va, vb } = edge;

      const isMatched = this.matchedEdges.includes(edge);

      context.beginPath();
      context.moveTo(va.x, va.y);
      context.lineTo(vb.x, vb.y);
      context.lineWidth = isMatched ? 1.5 : 1;
      context.strokeStyle = isMatched ? MATCHED_COLOR : UNMATCHED_COLOR;
      context.stroke();
    });

    this.dots.forEach(dot => {
      dot.render(context);
    });
  };
}

export default Board;
