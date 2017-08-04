import { linesAreCollinear } from "./geometry";

describe("Determining if two lines are collinear", () => {
  it("marks same line as collinear", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    const line2 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    expect(linesAreCollinear(line1, line2)).toBe(true);
  });

  it("marks different slopes as not collinear", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    const line2 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 0 } };
    expect(linesAreCollinear(line1, line2)).toBe(false);
  });

  it("marks parallel lines as not collinear", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    const line2 = { va: { x: 0, y: 10 }, vb: { x: 10, y: 20 } };
    expect(linesAreCollinear(line1, line2)).toBe(false);
  });

  it("marks different segments of same line as collinear", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 12, y: 12 } };
    const line2 = { va: { x: 10, y: 10 }, vb: { x: 20, y: 20 } };
    expect(linesAreCollinear(line1, line2)).toBe(true);
  });

  it("has a slight tolerance", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 12, y: 12 } };
    const line2 = { va: { x: 10, y: 10 }, vb: { x: 20, y: 21 } };
    expect(linesAreCollinear(line1, line2)).toBe(true);
  });

  it("works for larger lines", () => {
    const line1 = { va: { x: 0, y: 509 }, vb: { x: 1246, y: 579 } };
    const line2 = { va: { x: 0, y: 509 }, vb: { x: 1246, y: 580 } };
    expect(linesAreCollinear(line1, line2)).toBe(true);
  });

  it("does not mark disconnected lines as collinear", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    const line2 = { va: { x: 15, y: 15 }, vb: { x: 20, y: 20 } };
    expect(linesAreCollinear(line1, line2)).toBe(false);
  });
});