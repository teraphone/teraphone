/* eslint-disable no-console */
import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import Portal from '@mui/material/Portal';

export const ChildWindowContext = React.createContext<
  React.MutableRefObject<Window | null>
>({ current: null });

function WindowPortal(props: {
  id: string;
  title: string;
  width: number;
  height: number;
  children: JSX.Element;
  onClose: () => void;
}) {
  const [isMounted, setIsMounted] = React.useState(false);
  const { id, title, width, height, children, onClose } = props;
  const containerRef = React.useRef(document.createElement('div'));
  const windowRef = React.useRef<Window | null>(null);
  const cacheRef = React.useRef(
    createCache({ key: 'external', container: containerRef.current })
  );

  React.useEffect(() => {
    console.log('WindowPortal Mounted', title);
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      console.log('WindowPortal Unmounted', title);
      windowRef?.current?.close();
    };
  }, [title]);

  React.useEffect(() => {
    if (isMounted) {
      windowRef.current = window.open(
        'about:blank',
        id,
        `width=${width},height=${height},title=${title}`
      );

      if (windowRef.current) {
        windowRef.current.document.body.appendChild(containerRef.current);
        windowRef.current.document.body.style.margin = '0';
        windowRef.current.onunload = () => {
          onClose();
          windowRef?.current?.close();
        };
      }
    }
  }, [height, onClose, id, width, title, isMounted]);

  return (
    <Portal container={containerRef.current}>
      <ChildWindowContext.Provider key={id} value={windowRef}>
        <CacheProvider value={cacheRef.current}>{children}</CacheProvider>
      </ChildWindowContext.Provider>
    </Portal>
  );
}

export default WindowPortal;
