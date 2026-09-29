export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

/**
 * Where the menu actually goes, given where the pointer was.
 *
 * A menu opened near the right or bottom edge would otherwise run off it — so it flips to the
 * other side of the pointer, which is what every desktop menu does, and only clamps when it
 * does not fit either way. Clamping alone would leave the menu under the cursor with the first
 * item already beneath it.
 */
export function placeMenu(at: Point, menu: Size, viewport: Size, margin = 8): Point {
  const fitsRight = at.x + menu.width + margin <= viewport.width;
  const fitsBelow = at.y + menu.height + margin <= viewport.height;

  const x = fitsRight ? at.x : Math.max(margin, at.x - menu.width);
  const y = fitsBelow ? at.y : Math.max(margin, at.y - menu.height);

  return {
    x: Math.min(x, Math.max(margin, viewport.width - menu.width - margin)),
    y: Math.min(y, Math.max(margin, viewport.height - menu.height - margin)),
  };
}
