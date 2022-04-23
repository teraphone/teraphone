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

function LocalVideoView() {
  const dispatch = useAppDispatch();
  const { room } = useRoom();
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);

  return (
    <div>
      <div>Screens: {JSON.stringify(screens)}</div>
      <div>Windows: {JSON.stringify(windows)}</div>
    </div>
  );
}

export default LocalVideoView;
