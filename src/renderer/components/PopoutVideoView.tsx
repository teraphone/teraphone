/* eslint-disable no-console */
import * as React from 'react';
import Box from '@mui/material/Box';
import type { VideoItemValue } from '../lib/ExtendedUseRoom';
import WindowPortal from './WindowPortal';
import VideoItem from './VideoItem';
import { useAppSelector } from '../redux/hooks';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import { selectTeam } from '../redux/WorldSlice';

export interface PopoutVideoViewProps {
  sid: string;
  videoItem: VideoItemValue;
  setIsPopout: (sid: string, isPopout: boolean) => void;
}

function PopoutVideoView(props: PopoutVideoViewProps) {
  const { sid, videoItem, setIsPopout } = props;
  const { isLocal, userId, videoTrack } = videoItem;
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const teamInfo = useAppSelector((state) =>
    selectTeam(state, currentRoom.teamId)
  );
  let userName = teamInfo?.users.find((u) => u.oid === userId)?.name;
  if (!userName) {
    userName = 'Unknown';
  }

  const title = isLocal
    ? `Your Screen - T E R A P H O N E`
    : `${userName}'s Screen - T E R A P H O N E`;

  const popoutStyle: React.CSSProperties = {
    background: 'black',
    boxSizing: 'border-box',
    maxHeight: '100%',
    maxWidth: '100%',
    padding: '0px',
  };

  const handleClose = React.useCallback(() => {
    setIsPopout(sid, false);
  }, [setIsPopout, sid]);

  React.useEffect(() => {
    console.log('PopoutVideoView Mounted', videoItem);
    return () => {
      console.log('PopoutVideoView Unmounted', videoItem);
    };
  }, [videoItem]);

  return (
    <WindowPortal
      key={sid}
      id={sid}
      title={title}
      width={800}
      height={600}
      onClose={handleClose}
    >
      <Box style={popoutStyle}>
        <VideoItem videoTrack={videoTrack} isLocal={isLocal} />
      </Box>
    </WindowPortal>
  );
}

export default PopoutVideoView;
