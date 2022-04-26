/* eslint-disable no-console */
import * as React from 'react';
import {
  Room,
  LocalParticipant,
  ScreenShareCaptureOptions,
  ScreenSharePresets,
} from 'livekit-client';
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

  return (
    <div>
      <div>Screens: {JSON.stringify(screens)}</div>
      <div>Windows: {JSON.stringify(windows)}</div>
      <div>localParticipant: {JSON.stringify(room?.localParticipant)}</div>
    </div>
  );
}

export default React.memo(VideoView);
