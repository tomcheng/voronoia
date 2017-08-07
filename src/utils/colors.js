import random from "lodash/random";

const colors = [
  [76, 144, 237],
  [4, 172, 8],
  [222, 89, 77],
  [112, 190, 199],
  [52, 102, 87],
  [56, 56, 58],
  [161, 55, 52],
  [199, 61, 76],
  [65, 136, 136],
  [233, 91, 59],
  [55, 78, 78],
  [67, 72, 136],
  [63, 41, 127],
  [179, 67, 135],
  [59, 125, 125],
  [150, 58, 55],
  [91, 103, 52],
  [48, 93, 11],
  [161, 55, 52]
];

export const getRandomColor = () => colors[random(0, colors.length - 1)];

export const toRGBA = (color, alpha) => `rgba(${color.join(",")},${alpha})`;