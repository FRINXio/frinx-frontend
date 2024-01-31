import { inv } from 'mathjs'; // this should be imported from mathjs

export type Dimensions = {
  width: number;
  height: number;
};

export type Position = {
  x: number;
  y: number;
};
export type Matrix = [number, number, number, number, number, number];

const identityMatrix: Matrix = [1, 0, 0, 1, 0, 0];

export function identity(): Matrix {
  return [...identityMatrix];
}

export function translate(x: number, y: number): Matrix {
  return [1, 0, 0, 1, x, y];
}

export function scale(zoom: number): Matrix {
  return [zoom, 0, 0, zoom, 0, 0];
}

export function getDegreesFromRadians(radians: number): number {
  return radians * (180 / Math.PI);
}

export function getRadiansFromDegrees(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function rotate(angle: number): Matrix {
  const radians = getRadiansFromDegrees(angle);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [cos, sin, -sin, cos, 0, 0];
}

function multiplyTwoMatrices(m1: Matrix, m2: Matrix): Matrix {
  const [a1, b1, c1, d1, e1, f1] = m1;
  const [a2, b2, c2, d2, e2, f2] = m2;
  return [
    a1 * a2 + c1 * b2,
    b1 * a2 + d1 * b2,
    a1 * c2 + c1 * d2,
    b1 * c2 + d1 * d2,
    a1 * e2 + c1 * f2 + e1,
    b1 * e2 + d1 * f2 + f1,
  ];
}

export function multiplyMatrices(...args: Array<Matrix>): Matrix {
  return args.reduce(multiplyTwoMatrices, identityMatrix);
}

export function multiplyMatrixWithPosition(m: Matrix, p: Position): Position {
  const [a, b, c, d, e, f] = m;
  const { x, y } = p;

  const newX = a * x + c * y + e;
  const newY = b * x + d * y + f;

  return {
    x: newX,
    y: newY,
  };
}

export function getTransformMatrix(transform: Matrix, viewBoxWidth: number = 0): Matrix {
  const offsetMatrix = translate(viewBoxWidth / 2, 0);
  return multiplyMatrices(offsetMatrix, transform);
}

export function getInverseTransformMatrix(transform: Matrix, viewBoxWidth: number) {
  const t = getTransformMatrix(transform, viewBoxWidth);

  const transformMathMatrix = [
    [t[0], t[2], t[4]],
    [t[1], t[3], t[5]],
    [0, 0, 1],
  ];

  return inv(transformMathMatrix);
}

function positionDistance(p1: Position, p2: Position): number {
  const xd = p1.x - p2.x;
  const yd = p1.y - p2.y;
  return Math.sqrt(xd * xd + yd * yd);
}

export function getZoomLevel(transform: Matrix): number {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 1, y: 1 };

  const unitDistance = positionDistance(p1, p2);

  const transformedP1 = multiplyMatrixWithPosition(transform, p1);
  const transformedP2 = multiplyMatrixWithPosition(transform, p2);

  const transformedDistance = positionDistance(transformedP1, transformedP2);

  return transformedDistance / unitDistance;
}

export function getMidPoint(dimensions: Dimensions, transform: Matrix): Position {
  const mid = {
    x: dimensions.width / 2,
    y: dimensions.height / 2,
  };

  return multiplyMatrixWithPosition(transform, mid);
}
