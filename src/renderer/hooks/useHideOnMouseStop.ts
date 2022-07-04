/* eslint-disable no-console */
import * as React from 'react';

let timer: NodeJS.Timeout;

interface UseHideOnMouseStopProps {
  delay?: number;
  hideCursor?: boolean;
  initialHide?: boolean;
  showOnlyOnContainerHover?: boolean;
  targetDoc?: Document;
}

type UseHideOnMouseStopReturn = [
  boolean,
  (event: React.MouseEvent) => void,
  (event: React.MouseEvent) => void,
  (event: React.MouseEvent) => void
];

const useHideOnMouseStop = ({
  delay = 2000,
  hideCursor = false,
  initialHide = false,
  // showOnlyOnContainerHover = false,
  targetDoc = document,
}: UseHideOnMouseStopProps): UseHideOnMouseStopReturn => {
  const [hide, setHide] = React.useState(initialHide);
  const setVisibility = React.useCallback(
    (isHide: boolean, cursor: string) => {
      setHide(!isHide);
      if (hideCursor) {
        document.body.style.cursor = cursor;
      }
    },
    [hideCursor]
  );

  const onMouseEnter = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.type === 'mouseenter' && targetDoc.hasFocus()) {
        if (hide) {
          setVisibility(true, 'default');
        }
      }
    },
    [hide, setVisibility, targetDoc]
  );

  const onMouseLeave = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.type === 'mouseleave' && targetDoc.hasFocus()) {
        clearTimeout(timer);

        timer = setTimeout(() => {
          setVisibility(false, 'default');
        }, delay / 6);
      }
    },
    [delay, setVisibility, targetDoc]
  );

  const onMouseMove = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.type === 'mousemove' && targetDoc.hasFocus()) {
        clearTimeout(timer);

        if (hide) {
          setVisibility(true, 'default');
        }

        timer = setTimeout(() => {
          setVisibility(false, 'default');
        }, delay);
      }
    },
    [delay, hide, setVisibility, targetDoc]
  );

  return [hide, onMouseEnter, onMouseLeave, onMouseMove];
};

export default useHideOnMouseStop;
