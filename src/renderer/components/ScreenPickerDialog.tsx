/* eslint-disable no-console */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setScreens,
  setWindows,
  setPickerVisible,
  selectScreens,
  selectWindows,
  selectPickerVisible,
} from '../redux/ScreenShareSlice';
import useRoom from '../hooks/useRoom';

function ScreenPickerDialog() {
  const dispatch = useAppDispatch();
  const { room } = useRoom();
  const pickerVisible = useAppSelector(selectPickerVisible);
  const [screenSources, setScreenSources] = React.useState<
    Electron.DesktopCapturerSource[]
  >([]);
  const [windowSources, setwindowSources] = React.useState<
    Electron.DesktopCapturerSource[]
  >([]);

  const handleClose = () => {
    dispatch(setPickerVisible(false));
  };

  React.useEffect(() => {
    console.log('ScreenPickerDialog Mounted');
    return () => console.log('ScreenPickerDialog Unmounted');
  }, []);

  React.useEffect(() => {
    const asyncEffect = async () => {
      if (screenSources && pickerVisible) {
        const screens = await window.electron.ipcRenderer.queryScreens({
          types: ['screen'],
        });
        setScreenSources(screens);
        console.log('screenSources:', screens);
      }
      if (windowSources && pickerVisible) {
        const windows = await window.electron.ipcRenderer.queryScreens({
          types: ['window'],
        });
        setwindowSources(windows);
        console.log('windowSources:', windows);
      }
    };
    asyncEffect();
    // array-valued dependencies cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerVisible]);

  return (
    <Dialog fullScreen open={pickerVisible} onClose={handleClose}>
      <Button autoFocus color="inherit" onClick={handleClose}>
        close
      </Button>
    </Dialog>
  );
}

export default ScreenPickerDialog;
