import { assert, describe, expect, test } from 'vitest';
import { getDistanceBetweenPoints, getPointOnCircle, getPointOnSlope } from './topology/graph.helpers';

describe('graph helpers', () => {
  test('test edge curve position 0 degrees', () => {
    const source = { x: 0, y: 0 };
    const target = { x: 1, y: 0 };
    const position = getPointOnCircle(source, target);
    assert.deepEqual(position, { x: 1, y: 0 });
  });
  test('test edge curve position 45 degrees', () => {
    const source = { x: 0, y: 0 };
    const target = { x: 1, y: 1 };
    const { x, y } = getPointOnCircle(source, target);
    expect(x).toBeCloseTo(Math.sqrt(2) / 2);
    expect(y).toBeCloseTo(Math.sqrt(2) / 2);
  });
  test('test edge curve position 90 degrees', () => {
    const source = { x: 0, y: 0 };
    const target = { x: 0, y: 1 };
    const { x, y } = getPointOnCircle(source, target);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(1);
  });
  test('test point on slope 0 degrees (length 1)', () => {
    const source = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const { x, y } = getPointOnSlope(source, target, 1);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(1);
  });
  test('test point on slope 90 degrees (length 1)', () => {
    const source = { x: 0, y: 0 };
    const target = { x: 0, y: 1 };
    const { x, y } = getPointOnSlope(source, target, 1);
    expect(x).toBeCloseTo(-1);
    expect(y).toBeCloseTo(1);
  });
  test('test point on slope 180 degrees (length 1)', () => {
    const source = { x: 0, y: 0 };
    const target = { x: -1, y: 0 };
    const { x, y } = getPointOnSlope(source, target, 1);
    expect(x).toBeCloseTo(-1);
    expect(y).toBeCloseTo(-1);
  });
  test('test point on slope 270 degrees (length 1)', () => {
    const source = { x: 0, y: 0 };
    const target = { x: 0, y: -1 };
    const { x, y } = getPointOnSlope(source, target, 1);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(-1);
  });
  test('test get distance between points', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 1, y: 1 };
    const distance = getDistanceBetweenPoints(p1, p2);
    expect(distance).toBeCloseTo(1.414);
  });
});
