import { useEffect, useState, type RefObject } from 'react';
import type { DataGridHandle } from 'react-data-grid';

/**
 * How wide the grid's own scroller is, kept current.
 *
 * `clientWidth`, so the vertical scrollbar is already out of it — the columns have to fill what
 * is left of the box, not the box. It is 0 until the grid is mounted and 0 in a DOM that does
 * not lay anything out, which the width arithmetic reads as « nothing measured yet ».
 */
export function useGridBox(handle: RefObject<DataGridHandle | null>, mounted: boolean): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = handle.current?.element;
    if (!element) return;
    // Read on the next frame rather than inside the callback: a resize that adds or removes a
    // scrollbar reaches the observer before the layout that shows it, and a width measured one
    // frame early is a width the columns then overflow by exactly a scrollbar.
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setWidth(element.clientWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [handle, mounted]);

  return width;
}
