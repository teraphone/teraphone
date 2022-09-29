/* eslint-disable no-console */
import * as React from 'react';
import Box from '@mui/material/Box';
import { Track } from 'livekit-client';
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
  const sourceType = videoTrack.source;
  const isScreen = sourceType === Track.Source.ScreenShare;
  const device = isScreen ? 'Screen' : 'Camera';

  const title = isLocal
    ? `Your ${device} - T E R A P H O N E`
    : `${userName}'s ${device} - T E R A P H O N E`;

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
      <Box
        sx={{
          alignItems: 'center',
          background: 'black',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          padding: 0,
          width: '100%',
        }}
      >
        <VideoItem videoTrack={videoTrack} isLocal={isLocal} />
      </Box>
    </WindowPortal>
  );
}

export default PopoutVideoView;
