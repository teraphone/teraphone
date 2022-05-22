/* eslint-disable no-console */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

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
  const { id, title, width, height, children, onClose } = props;
  const containerRef = React.useRef(document.createElement('div'));
  const windowRef = React.useRef<Window | null>(null);
  const cacheRef = React.useRef(
    createCache({ key: 'external', container: containerRef.current })
  );

  React.useEffect(() => {
    console.log('WindowPortal Mounted', title);
    return () => {
      console.log('WindowPortal Unmounted', title);
    };
  }, [title]);

  React.useEffect(() => {
    windowRef.current = window.open(
      'about:blank',
      title,
      `width=${width},height=${height}`
    );

    if (windowRef.current) {
      windowRef.current.document.body.appendChild(containerRef.current);
      windowRef.current.document.body.style.margin = '0';
      windowRef.current.onunload = () => {
        onClose();
      };
    }
  }, [height, onClose, title, width]);

  return ReactDom.createPortal(
    <ChildWindowContext.Provider value={windowRef}>
      <CacheProvider value={cacheRef.current}>{children}</CacheProvider>
    </ChildWindowContext.Provider>,
    containerRef.current,
    id
  );
}

export default React.memo(WindowPortal);
