import { Circle } from "@thomascheng/canvas-utils";

class Dot {
  constructor({ x, y, color }) {
    this.x = x;
    this.y = y;
    this.selected = false;
    this.circle = new Circle({
      x, y, radius: 1.5, fill: color
    });
    this.outerCircle = new Circle({
      x, y, radius: 15, fill: "rgba(0,0,0,0.05)"
    });
  }

  render = context => {
    this.circle.x = this.x;
    this.circle.y = this.y;

    if (this.selected) {
      this.outerCircle.x = this.x;
      this.outerCircle.y = this.y;
      this.outerCircle.render(context);
    }
    this.circle.render(context);
  };
}

export default Dot;