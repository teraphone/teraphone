/* eslint-disable no-console */
import * as React from 'react';
import { Room, LocalParticipant } from 'livekit-client';
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

function VideoView() {
  const dispatch = useAppDispatch();
  const { room } = useRoom();
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);

  const startStream = (localParticipant: LocalParticipant, id: string) => {
    console.log('starting stream', id);
    localParticipant.extendedCreateScreenTracks(id);
    localParticipant.extendedSetTrackEnabled(id, true);
  };

  React.useEffect(() => {
    if (room) {
      if (Object.keys(screens).length > 0) {
        Object.entries(screens).forEach(([id, _]) => {
          startStream(room.localParticipant, id);
        });
      }

      if (Object.keys(windows).length > 0) {
        Object.entries(windows).forEach(([id, _]) => {
          startStream(room.localParticipant, id);
        });
      }
    }
  }, [room, screens, windows]);

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
