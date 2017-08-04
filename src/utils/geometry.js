export const linesAreCollinear = (line1, line2) => {
  const { va: a1, vb: b1 } = line1;
  const { va: a2, vb: b2 } = line2;
  const tolerance = length(line1);

  return (
    Math.abs(crossProduct(vector(a2, a1), vector(a2, b1))) <= tolerance &&
    Math.abs(crossProduct(vector(b2, a1), vector(b2, b1))) <= tolerance
  );
};

const vector = (p1, p2) => ({ x: p2.x - p1.x, y: p2.y - p1.y });

const crossProduct = (u, v) => u.x * v.y - u.y * v.x;

const length = ({ va, vb }) => Math.sqrt((vb.x - va.x)**2 + (vb.y - va.y)**2);