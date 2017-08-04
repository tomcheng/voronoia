import { linesAreCollinear } from "./geometry";

describe("Determining if two lines are collinear", () => {
  it("should mark same line as collinear", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    const line2 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    expect(linesAreCollinear(line1, line2)).toBe(true);
  });

  it("should mark different slopes as not collinear", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    const line2 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 0 } };
    expect(linesAreCollinear(line1, line2)).toBe(false);
  });

  it("should mark parallel lines as not collinear", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    const line2 = { va: { x: 0, y: 10 }, vb: { x: 10, y: 20 } };
    expect(linesAreCollinear(line1, line2)).toBe(false);
  });

  it("should mark different segments of same line as collinear", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    const line2 = { va: { x: 10, y: 10 }, vb: { x: 20, y: 20 } };
    expect(linesAreCollinear(line1, line2)).toBe(true);
  });

  it("should have a slight tolerance", () => {
    const line1 = { va: { x: 0, y: 0 }, vb: { x: 10, y: 10 } };
    const line2 = { va: { x: 10, y: 10 }, vb: { x: 20, y: 21 } };
    expect(linesAreCollinear(line1, line2)).toBe(true);
  });

  it("should work for larger lines", () => {
    const line1 = { va: { x: 0, y: 509 }, vb: { x: 1246, y: 579 } };
    const line2 = { va: { x: 0, y: 509 }, vb: { x: 1246, y: 580 } };
    expect(linesAreCollinear(line1, line2)).toBe(true);
  });
});