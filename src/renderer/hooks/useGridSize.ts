import { useState, useLayoutEffect, RefObject } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

function getGridSize(target: HTMLElement) {
  const gridComputedStyle = window.getComputedStyle(target);
  const columns = gridComputedStyle
    .getPropertyValue('grid-template-columns')
    .split(' ').length;
  const rows = gridComputedStyle
    .getPropertyValue('grid-template-rows')
    .split(' ').length;

  return { columns, rows };
}

const useGridSize = (target?: HTMLElement) => {
  const [gridSize, setGridSize] = useState<{
    columns?: number;
    height?: number;
    rows?: number;
    width?: number;
  }>({ columns: undefined, rows: undefined });

  useLayoutEffect(() => {
    if (target) {
      const { columns, rows } = getGridSize(target);
      const { height, width } = target.getBoundingClientRect();
      setGridSize({ columns, height, rows, width });
      console.log('useLayoutEffect', 'gridSize:', gridSize);
    }
  }, [target]);

  // Use the ResizeObserver API to update grid rows and columns count when
  // resized
  // See https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
  // `resizeObserverEntry.target` is the Element being observed
  // See https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry
  useResizeObserver(target ?? null, (resizeObserverEntry) => {
    if (resizeObserverEntry?.target) {
      const { columns, rows } = getGridSize(
        resizeObserverEntry.target as HTMLElement
      );
      const { height, width } = resizeObserverEntry.contentRect;
      setGridSize({ columns, height, rows, width });
      console.log('useResizeObserver', 'gridSize:', gridSize);
    }
  });

  return gridSize;
};

export default useGridSize;
