/* eslint-disable no-console */
import * as React from 'react';

let timer: NodeJS.Timeout;

interface UseHideOnMouseStopProps {
  delay?: number;
  hideCursor?: boolean;
  initialHide?: boolean;
  showOnlyOnContainerHover?: boolean;
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
  showOnlyOnContainerHover = false,
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
      if (event.type === 'mouseenter') {
        console.log('onMouseEnter', 'hide', hide);
        if (hide) {
          setVisibility(true, 'default');
        }
      }
    },
    [hide, setVisibility]
  );

  const onMouseLeave = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.type === 'mouseleave') {
        console.log('onMouseLeave', 'hide', hide);
        clearTimeout(timer);

        timer = setTimeout(() => {
          setVisibility(false, 'default');
        }, delay / 6);
      }
    },
    [delay, hide, setVisibility]
  );

  const onMouseMove = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.type === 'mousemove') {
        console.log('onMouseMove', 'hide', hide);
        clearTimeout(timer);

        if (hide) {
          setVisibility(true, 'default');
        }

        timer = setTimeout(() => {
          setVisibility(false, 'default');
        }, delay);
      }
    },
    [delay, hide, setVisibility]
  );

  return [hide, onMouseEnter, onMouseLeave, onMouseMove];
};

export default useHideOnMouseStop;
