import { Circle } from "@thomascheng/canvas-utils";

class Dot {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.circle = new Circle({
      x, y, radius: 2, fill: "#000"
    })
  }

  render = context => {
    this.circle.x = this.x;
    this.circle.y = this.y;
    this.circle.render(context);
  };
}

export default Dot;