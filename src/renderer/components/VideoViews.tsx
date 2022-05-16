/* eslint-disable no-console */
import * as React from 'react';
import {
  Room,
  RoomEvent,
  LocalParticipant,
  ScreenShareCaptureOptions,
  LocalTrackPublication,
  LocalTrack,
  VideoPresets,
  Track,
  RemoteTrackPublication,
  RemoteParticipant,
} from 'livekit-client';
import WindowPortal from './WindowPortal';
import MainVideoView, { VideoItemsObject } from './MainVideoView';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWindowOpen, setWindowOpen } from '../redux/VideoViewSlice';

function VideoViews() {
  const dispatch = useAppDispatch();
  const videoViewWindowOpen = useAppSelector(selectWindowOpen);

  const handleCloseVideoView = React.useCallback(() => {
    dispatch(setWindowOpen(false));
  }, [dispatch]);

  return (
    <>
      {videoViewWindowOpen && (
        <WindowPortal
          title="Video - T E R A P H O N E"
          width={800}
          height={600}
          onClose={handleCloseVideoView}
        >
          <>
            {/* <VideoView /> */}
            <MainVideoView />
          </>
        </WindowPortal>
      )}
    </>
  );
}

export default VideoViews;
