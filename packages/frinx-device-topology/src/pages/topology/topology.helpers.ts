import { WheelEvent } from 'react';

// Reasonable defaults
const PIXEL_STEP = 10;
const LINE_HEIGHT = 40;
const PAGE_HEIGHT = 800;

// Our boundaries for pixelY
const MAX = 1000;
const MIN = -1000;

function ensureBoundaries(value: number): number {
  return Math.min(Math.max(value, MIN), MAX);
}

/**
 * Returns normalized 'pixelY' for mouse-wheel event.
 */
export function normalizeWheelPixelY(event: WheelEvent<SVGSVGElement>): number {
  const spinY: number = 'detail' in event ? event.detail : 0;

  const pixelY: number = 'deltaY' in event ? event.deltaY : spinY * PIXEL_STEP;

  if (event.deltaMode === 0) {
    return ensureBoundaries(pixelY);
  }

  if (event.deltaMode === 1) {
    // delta in LINE units
    return ensureBoundaries(pixelY * LINE_HEIGHT);
  }

  // delta in PAGE units
  return ensureBoundaries(pixelY * PAGE_HEIGHT);
}
