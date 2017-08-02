import Dot from "./Dot";

class Board {
  constructor({ width, height }) {
    this.dots = [];
    this.width = width;
    this.height = height;
  }

  handleClick = ({ x, y }) => {
    this.dots.push(new Dot({ x, y }));
  };

  render = context => {
    this.dots.forEach(dot => {
      dot.render(context);
    });
  }
}

export default Board;