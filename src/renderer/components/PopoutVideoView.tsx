import * as React from 'react';
import Box from '@mui/material/Box';
import type { VideoItemValue } from './MainVideoView';
import { ChildWindowContext } from './WindowPortal';
import VideoItem from './VideoItem';

export interface PopoutVideoViewProps {
  sid: string;
  videoItem: VideoItemValue;
  setIsPopout: (sid: string, isPopout: boolean) => void;
}

function PopoutVideoView(props: PopoutVideoViewProps) {
  const { sid, videoItem, setIsPopout } = props;
  const { isLocal, videoTrack } = videoItem;
  const windowRef = React.useContext(ChildWindowContext);
  const thisWindow = windowRef.current;
  const popoutStyle: React.CSSProperties = {
    background: 'black',
    boxSizing: 'border-box',
    maxHeight: '100%',
    maxWidth: '100%',
    padding: '0px',
  };

  const handleWindowClose = React.useCallback(() => {
    setIsPopout(sid, false);
  }, [setIsPopout, sid]);

  React.useEffect(() => {
    if (thisWindow) {
      thisWindow.addEventListener('beforeunload', handleWindowClose);
      return () => {
        thisWindow.removeEventListener('beforeunload', handleWindowClose);
      };
    }
    return () => {};
  }, [handleWindowClose, thisWindow]);

  return (
    <Box style={popoutStyle}>
      <VideoItem videoTrack={videoTrack} isLocal={isLocal} />
    </Box>
  );
}

export default PopoutVideoView;
