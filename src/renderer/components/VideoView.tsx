/* eslint-disable no-console */
import * as React from 'react';
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

  React.useEffect(() => {
    if (room) {
      room.localParticipant.extendedCreateScreenTracks('');
      room.localParticipant.extendedSetTrackEnabled('', true);
    }
  }, [room]);

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
