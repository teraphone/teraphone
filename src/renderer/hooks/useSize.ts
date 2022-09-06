import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

function getGridSize(target: HTMLElement) {
  const gridComputedStyle = window.getComputedStyle(target);
  const gridTemplateColumns = gridComputedStyle.getPropertyValue(
    'grid-template-columns'
  );
  const gridTemplateRows =
    gridComputedStyle.getPropertyValue('grid-template-rows');

  if (gridTemplateColumns === 'none' || gridTemplateRows === 'none') {
    return { columns: 0, rows: 0 };
  }

  const columns = gridTemplateColumns.split(' ').length;
  const rows = gridTemplateRows.split(' ').length;

  return { columns, rows };
}

/**
 * This hook observes the dimensions of the target element as well as the
 * number of columns and rows if a CSS grid
 * @param extraDependency An extra dependency that can trigger a recalculation
 * of the size and grid (in addition to the resize observer), e.g. the number
 * of items in the grid
 * @returns {{columns, rows, width, height, refCallback}} Pass `refCallback` to
 * the `ref` prop of the element you want to observe. `columns` and `rows` will
 * be 0 if the element is not a CSS grid (or it has no children).
 * @example
 * const { rows, columns, width, height, refCallback } = useSize({
 *   extraDependency: gridItems.length
 * });
 * return (
 *   <div
 *     ref={gridRefCallback}
 *     style={{
 *       display: 'grid',
 *       gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
 *     }}
 *   >
 *     {gridItems}
 *   </div>
 * );
 */
const useSize = (extraDependency?: unknown) => {
  const [gridSize, setGridSize] = useState<{
    columns?: number;
    height?: number;
    rows?: number;
    width?: number;
  }>({});
  const nodeRef = useRef<HTMLElement | null>(null);

  // Update when ref gets attached to a different node
  const refCallback = useCallback((node: HTMLElement) => {
    nodeRef.current = node;
    if (nodeRef?.current) {
      const { columns, rows } = getGridSize(nodeRef.current);
      const { height, width } = nodeRef.current.getBoundingClientRect();
      setGridSize({ columns, height, rows, width });
    }
  }, []);

  // Update when extraDependency changes
  useLayoutEffect(() => {
    if (nodeRef?.current) {
      const { columns, rows } = getGridSize(nodeRef.current);
      const { height, width } = nodeRef.current.getBoundingClientRect();
      setGridSize({ columns, height, rows, width });
    }
  }, [extraDependency]);

  // Use the ResizeObserver API to update when resized
  // See https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
  // `resizeObserverEntry.target` is the Element being observed
  // See https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry
  useResizeObserver(nodeRef.current, (resizeObserverEntry) => {
    if (resizeObserverEntry?.target) {
      const { columns, rows } = getGridSize(
        resizeObserverEntry.target as HTMLElement
      );
      const { height, width } =
        resizeObserverEntry.target.getBoundingClientRect();
      setGridSize({ columns, height, rows, width });
    }
  });

  return { ...gridSize, refCallback };
};

export default useSize;
