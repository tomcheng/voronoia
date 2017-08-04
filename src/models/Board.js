import Voronoi from "voronoi/rhill-voronoi-core";
import find from "lodash/find";
import Dot from "./Dot";
import random from "lodash/random";
import { linesAreCollinear, getMirror } from "../utils/geometry";

const THRESHOLD = 15;
const NUM_DOTS = 20;
const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

class Board {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
    this.voronoi = new Voronoi();
    this.selectedDot = null;
    this.matchedEdges = [];
    this.activeEdges = [];
    this.dots = this._generateRandomDots(NUM_DOTS);
    this.virtualDots = this._generateRandomDots(NUM_DOTS);

    const box = { xl: 0, xr: this.width, yt: 0, yb: this.height };
    const diagram = this.voronoi.compute(this.dots, box);
    const virtualDiagram = this.voronoi.compute(this.virtualDots, box);

    this.edges = diagram.edges.filter(e => e.lSite && e.rSite);
    this.virtualEdges = virtualDiagram.edges.filter(e => e.lSite && e.rSite);
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

  _updateEdges = () => {
    const box = { xl: 0, xr: this.width, yt: 0, yb: this.height };
    const diagram = this.voronoi.compute(this.dots, box);
    this.edges = diagram.edges.filter(e => e.lSite && e.rSite);
  };

  _updateMatchedEdges = () => {
    this.matchedEdges = this.edges.filter(e =>
      this.virtualEdges.some(ve => linesAreCollinear(e, ve))
    );
  };

  _adjustAlmostMatchedDots = () => {
    this.dots.forEach(dot => {
      const matchedDot = find(this.virtualDots, vd => distance(dot, vd) < 5);

      if (matchedDot) {
        dot.x = matchedDot.x;
        dot.y = matchedDot.y;
        dot.matched = true;
      } else {
        dot.matched = false;
      }
    });
  };

  handleMouseDown = ({ x, y }) => {
    const selected = find(
      this.dots,
      dot => distance(dot, { x, y }) < THRESHOLD
    );

    if (!selected) {
      return;
    }

    this.selectedDot = selected;
    this.activeEdges = this.matchedEdges.filter(
      edge => edge.lSite === selected || edge.rSite === selected
    );
  };

  handleMouseMove = ({ x, y }) => {
    if (!this.selectedDot) {
      return;
    }
    this.selectedDot.x = x;
    this.selectedDot.y = y;
    this.activeEdges.forEach(edge => {
      const otherDot =
        edge.lSite === this.selectedDot ? edge.rSite : edge.lSite;
      const mirror = getMirror({
        point: { x: this.selectedDot.x, y: this.selectedDot.y },
        line: { va: edge.va, vb: edge.vb }
      });
      otherDot.x = mirror.x;
      otherDot.y = mirror.y;
    });
    this._updateEdges();
  };

  handleMouseUp = () => {
    if (!this.selectedDot) {
      return;
    }

    this.selectedDot = null;
    this._adjustAlmostMatchedDots();
    this._updateEdges();
    this._updateMatchedEdges();
  };

  render = context => {
    this.edges.forEach(edge => {
      const { va, vb } = edge;

      const isMatched = this.virtualEdges.some(e => linesAreCollinear(e, edge));

      context.beginPath();
      context.moveTo(va.x, va.y);
      context.lineTo(vb.x, vb.y);
      context.lineWidth = 1;
      context.strokeStyle = isMatched ? "red" : "#000";
      context.stroke();
    });

    this.virtualEdges.forEach(edge => {
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
