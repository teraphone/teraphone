/* eslint-disable no-console */
import * as React from 'react';
import * as ReactDom from 'react-dom';

function WindowPortal(props: {
  title: string;
  width: number;
  height: number;
  children: JSX.Element;
  onClose: () => void;
}) {
  const { title, width, height, children, onClose } = props;
  const containerRef = React.useRef(document.createElement('div'));
  const windowRef = React.useRef<Window | null>(null);

  React.useEffect(() => {
    console.log('WindowPortal Mounted');
    return () => console.log('WindowPortal Unmounted');
  }, []);

  React.useEffect(() => {
    windowRef.current = window.open(
      'about:blank',
      title,
      `width=${width},height=${height}`
    );

    if (windowRef.current) {
      windowRef.current.document.body.appendChild(containerRef.current);
      windowRef.current.onunload = () => {
        onClose();
      };
    }
  }, [containerRef, height, onClose, title, width]);

  return ReactDom.createPortal(children, containerRef.current, title);
}

export default React.memo(WindowPortal);
