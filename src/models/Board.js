import Voronoi from "voronoi/rhill-voronoi-core";
import find from "lodash/find";
import Dot from "./Dot";

const THRESHOLD = 15;
const distance = (a, b) => Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);

class Board {
  constructor({ width, height }) {
    this.dots = [];
    this.width = width;
    this.height = height;
    this.voronoi = new Voronoi();
    this.selected = null;
  }

  handleClick = ({ x, y }) => {
    if (this.selected) {
      return;
    }

    this.dots.push(new Dot({ x, y }));
  };

  handleMouseDown = ({ x, y }) => {
    this.selected = find(this.dots, dot => distance(dot, { x, y }) < THRESHOLD);
  };

  handleMouseMove = ({ x, y }) => {
    if (!this.selected) {
      return;
    }

    this.selected.x = x;
    this.selected.y = y;
  };

  handleMouseUp = () => {
    setTimeout(() => { this.selected = null; }, 1);
  };

  render = context => {
    const box = { xl: 0, xr: this.width, yt: 0, yb: this.height };
    const sites = this.dots.map(dot => ({ x: dot.x, y: dot.y }));
    const diagram = this.voronoi.compute(sites, box);

    diagram.edges.filter(edge => edge.lSite && edge.rSite).forEach(edge => {
      const { va, vb } = edge;

      context.beginPath();
      context.moveTo(va.x, va.y);
      context.lineTo(vb.x, vb.y);
      context.lineWidth = 1;
      context.strokeStyle = "#000";
      context.stroke();
    });

    this.dots.forEach(dot => {
      dot.render(context);
    });
  };
}

export default Board;
