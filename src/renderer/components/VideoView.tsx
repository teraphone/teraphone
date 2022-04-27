/* eslint-disable no-console */
import * as React from 'react';
import {
  Room,
  LocalParticipant,
  ScreenShareCaptureOptions,
  ScreenSharePresets,
  LocalTrackPublication,
  LocalTrack,
  VideoPresets,
} from 'livekit-client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { VideoRenderer } from './VideoRenderer';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setScreens,
  setWindows,
  setPickerVisible,
  selectScreens,
  selectWindows,
  selectPickerVisible,
  ScreenSource,
} from '../redux/ScreenShareSlice';
import useRoom from '../hooks/useRoom';
import { selectAppUser } from '../redux/AppUserSlice';

function VideoView() {
  const dispatch = useAppDispatch();
  const { room } = useRoom();
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);
  const { appUser } = useAppSelector(selectAppUser);
  const localVideoTracks = room?.localParticipant?.videoTracks;

  const startStream = (
    localParticipant: LocalParticipant,
    userId: string,
    sourceId: string
  ) => {
    console.log('starting stream', sourceId);
    const options: ScreenShareCaptureOptions = {
      audio: false,
      resolution: ScreenSharePresets.h1080fps15,
    };
    localParticipant.setScreenShareTrackEnabled(
      userId,
      sourceId,
      true,
      options
    );
  };

  React.useEffect(() => {
    if (room) {
      if (Object.keys(screens).length > 0) {
        Object.entries(screens).forEach(([sourceId, _]) => {
          startStream(room.localParticipant, appUser.id.toString(), sourceId);
        });
      }

      if (Object.keys(windows).length > 0) {
        Object.entries(windows).forEach(([sourceId, _]) => {
          startStream(room.localParticipant, appUser.id.toString(), sourceId);
        });
      }
    }
    console.log('localParticipant', room?.localParticipant);
  }, [appUser.id, room, screens, windows]);

  React.useEffect(() => {
    console.log('VideoView Mounted');
    return () => {
      console.log('VideoView Unmounted');
    };
  }, []);

  const localVideoRenderers: JSX.Element[] = [];
  if (localVideoTracks) {
    localVideoTracks.forEach((value: LocalTrackPublication, key: string) => {
      localVideoRenderers.push(
        <Box>
          <VideoRenderer
            // eslint-disable-next-line react/no-array-index-key
            key={key}
            track={value.track as LocalTrack}
            isLocal
            objectFit="scale-down"
            height={VideoPresets.h1080.height.toString()}
            width={VideoPresets.h1080.width.toString()}
          />
        </Box>
      );
    });
  }

  return (
    <Box sx={{ width: 500, height: 500, backgroundColor: 'primary.dark' }}>
      <Button variant="contained">asdf</Button>
      <Box>Screens: {JSON.stringify(screens)}</Box>
      <Box>Windows: {JSON.stringify(windows)}</Box>
      <Box>{localVideoRenderers}</Box>
    </Box>
  );
}

export default React.memo(VideoView);
