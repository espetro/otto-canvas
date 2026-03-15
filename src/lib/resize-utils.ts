import type { ResizeHandle } from "./types";

export const MIN_SIZE = 64;

export interface NewDimensions {
  width: number;
  height: number;
  dx: number;  // position offset for NW/SW handles (x changes)
  dy: number;  // position offset for NW/NE handles (y changes)
}

/**
 * Calculate new item dimensions when dragging a resize handle.
 * Aspect ratio is always preserved.
 *
 * @param handle    - Which corner handle is being dragged
 * @param deltaX    - Mouse delta X in CANVAS coordinates (already divided by scale)
 * @param deltaY    - Mouse delta Y in CANVAS coordinates (already divided by scale)
 * @param origW     - Original item width
 * @param origH     - Original item height
 * @param aspectRatio - width/height ratio to preserve (origW/origH)
 * @returns New dimensions and position offsets
 */
export function calculateNewDimensions(
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number,
  origW: number,
  origH: number,
  aspectRatio: number
): NewDimensions {
  let rawWidth: number;
  let dx = 0;
  let dy = 0;

  switch (handle) {
    case "se":
      // SE: grows down-right → use deltaX as primary (positive = grow)
      rawWidth = origW + deltaX;
      break;
    case "ne":
      // NE: grows up-right → use deltaX as primary, top edge moves up
      rawWidth = origW + deltaX;
      dy = -(rawWidth - origW) / aspectRatio; // top moves up when growing
      break;
    case "sw":
      // SW: grows down-left → use -deltaX as primary, left edge moves left
      rawWidth = origW - deltaX;
      dx = origW - rawWidth; // left edge shifts left when growing
      break;
    case "nw":
      // NW: grows up-left → both edges move
      rawWidth = origW - deltaX;
      dx = origW - rawWidth; // left edge shifts
      dy = -(rawWidth - origW) / aspectRatio; // top moves up when growing
      break;
  }

  // Enforce minimum size
  const clampedWidth = Math.max(MIN_SIZE, rawWidth);
  const clampedHeight = Math.max(MIN_SIZE, clampedWidth / aspectRatio);

  // Recalculate actual clamped width from height if height was the constraint
  const finalWidth = clampedHeight * aspectRatio;
  const finalHeight = clampedHeight;

  // Recalculate position offsets based on actual final size
  const actualDW = finalWidth - origW;
  const actualDH = finalHeight - origH;

  switch (handle) {
    case "ne":
      dy = -actualDH;
      break;
    case "sw":
      dx = -actualDW;
      break;
    case "nw":
      dx = -actualDW;
      dy = -actualDH;
      break;
  }

  return { width: finalWidth, height: finalHeight, dx, dy };
}

/**
 * Get the appropriate cursor CSS class for a resize handle.
 */
export function getResizeCursor(handle: ResizeHandle): string {
  const cursorMap: Record<ResizeHandle, string> = {
    nw: "cursor-nw-resize",
    ne: "cursor-ne-resize",
    sw: "cursor-sw-resize",
    se: "cursor-se-resize",
  };
  return cursorMap[handle];
}
