import { Circle } from "@thomascheng/canvas-utils";

class Dot {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.matched = false;
    this.selected = false;
    this.circle = new Circle({
      x, y, radius: 2, fill: "#000"
    });
    this.outerCircle = new Circle({
      x, y, radius: 15, fill: "rgba(0,0,0,0.05)"
    });
  }

  render = context => {
    this.circle.x = this.x;
    this.circle.y = this.y;
    this.circle.fill = this.matched ? "#04ac08" : "#000";

    if (this.selected) {
      this.outerCircle.x = this.x;
      this.outerCircle.y = this.y;
      this.outerCircle.render(context);
    }
    this.circle.render(context);
  };
}

export default Dot;