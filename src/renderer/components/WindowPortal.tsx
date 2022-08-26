/* eslint-disable no-console */
import {
  createContext,
  MutableRefObject,
  useState,
  useRef,
  useEffect,
} from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import Portal from '@mui/material/Portal';

export const ChildWindowContext = createContext<
  MutableRefObject<Window | null>
>({ current: null });

function WindowPortal(props: {
  id: string;
  title: string;
  width: number;
  height: number;
  children: JSX.Element;
  onClose: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { id, title, width, height, children, onClose } = props;
  const containerDiv = document.createElement('div');
  containerDiv.setAttribute('class', 'window-portal');
  containerDiv.setAttribute('style', 'height: 100%');
  const containerRef = useRef(containerDiv);
  const windowRef = useRef<Window | null>(null);
  const cacheRef = useRef(
    createCache({ key: 'external', container: containerRef.current })
  );

  useEffect(() => {
    console.log('WindowPortal Mounted', title);
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      console.log('WindowPortal Unmounted', title);
      windowRef?.current?.close();
    };
  }, [title]);

  useEffect(() => {
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

  return isMounted ? (
    <Portal container={containerRef.current}>
      <ChildWindowContext.Provider key={id} value={windowRef}>
        <CacheProvider value={cacheRef.current}>{children}</CacheProvider>
      </ChildWindowContext.Provider>
    </Portal>
  ) : null;
}

export default WindowPortal;
