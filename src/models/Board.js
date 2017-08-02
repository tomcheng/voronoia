import Dot from "./Dot";
import Voronoi from "voronoi/rhill-voronoi-core";

class Board {
  constructor({ width, height }) {
    this.dots = [];
    this.width = width;
    this.height = height;
    this.voronoi = new Voronoi();
  }

  handleClick = ({ x, y }) => {
    this.dots.push(new Dot({ x, y }));
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
