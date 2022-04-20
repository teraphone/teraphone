/* eslint-disable no-console */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Tab, Typography } from '@mui/material';
import { TabContext, TabList, useTabContext } from '@mui/lab';
import { NativeImage } from 'electron';
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
import { SerializedDesktopCapturerSource } from '../global';

function ScreenPickerTabPanel(props: {
  children: React.ReactNode;
  value: string;
}) {
  const { children, value: id } = props;
  const context = useTabContext();
  if (context === null) {
    throw new TypeError('No TabContext provided');
  }
  const tabId = context.value;
  return <div hidden={tabId !== id}>{children}</div>;
}

function ScreenPickerDialog() {
  const dispatch = useAppDispatch();
  const { room } = useRoom();
  const [screenSources, setScreenSources] = React.useState<
    SerializedDesktopCapturerSource[]
  >([]);
  const [windowSources, setwindowSources] = React.useState<
    SerializedDesktopCapturerSource[]
  >([]);
  const pickerVisible = useAppSelector(selectPickerVisible);
  const [tabId, setTabId] = React.useState('tab1');

  const handleDialogClose = () => {
    dispatch(setPickerVisible(false));
  };

  const handleSubmit = () => {
    console.log('handleSubmit');
    dispatch(setPickerVisible(false));
  };

  const handleTabChange = (_event: React.SyntheticEvent, id: string) => {
    setTabId(id);
  };

  React.useEffect(() => {
    console.log('ScreenPickerDialog Mounted');
    return () => console.log('ScreenPickerDialog Unmounted');
  }, []);

  React.useEffect(() => {
    const asyncEffect = async () => {
      const thumbWidth = 150;
      const thumbHeight = 150;
      if (screenSources && pickerVisible) {
        const screens = await window.electron.ipcRenderer.queryScreens({
          thumbnailSize: {
            width: thumbWidth,
            height: thumbHeight,
          },
          types: ['screen'],
        });
        setScreenSources(screens);
        console.log('screenSources:', screens);
      }
      if (windowSources && pickerVisible) {
        const windows = await window.electron.ipcRenderer.queryScreens({
          thumbnailSize: {
            width: thumbWidth,
            height: thumbHeight,
          },
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

  let windowThumbs: React.ReactNode[] = [];
  if (windowSources.length > 0) {
    windowThumbs = windowSources.map((source) => {
      return (
        <div key={source.id}>
          <div>
            <img src={source.thumbnailDataURL} alt="" />
          </div>
          <br />
        </div>
      );
    });
  }

  let screenThumbs: React.ReactNode[] = [];
  if (screenSources.length > 0) {
    screenThumbs = screenSources.map((source) => {
      return (
        <div key={source.id}>
          <div>
            <img src={source.thumbnailDataURL} alt="" />
          </div>
          <br />
        </div>
      );
    });
  }

  return (
    <TabContext value={tabId}>
      <Dialog
        fullScreen
        open={pickerVisible}
        onClose={handleDialogClose}
        scroll="paper"
      >
        <DialogTitle>Screen Share</DialogTitle>
        <Typography variant="body1">
          Select one or more screens to share with the room!
        </Typography>
        <TabList value={tabId} variant="standard" onChange={handleTabChange}>
          <Tab value="tab1" label="Applications" />
          <Tab value="tab2" label="Screens" />
        </TabList>

        <DialogContent dividers>
          <ScreenPickerTabPanel value="tab1">
            <span>This is the Applications tab</span>
            {windowThumbs}
          </ScreenPickerTabPanel>
          <ScreenPickerTabPanel value="tab2">
            <span>This is the Screens tab</span>
            {screenThumbs}
          </ScreenPickerTabPanel>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="inherit" onClick={handleDialogClose}>
            Close
          </Button>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </TabContext>
  );
}

export default ScreenPickerDialog;
