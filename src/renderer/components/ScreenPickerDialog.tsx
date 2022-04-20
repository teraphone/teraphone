/* eslint-disable no-console */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Tab } from '@mui/material';
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
    Electron.DesktopCapturerSource[]
  >([]);
  const [windowSources, setwindowSources] = React.useState<
    Electron.DesktopCapturerSource[]
  >([]);
  const pickerVisible = useAppSelector(selectPickerVisible);
  const [tabId, setTabId] = React.useState('tab1');

  const handleDialogClose = () => {
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

  let windowThumbs: React.ReactNode[] = [];
  if (windowSources.length > 0) {
    windowThumbs = windowSources.map((source, index) => {
      console.log('windowSources.map:', source);
      return <img src={} alt="" key={source.id} />;
    });
  }

  let screenThumbs: React.ReactNode[] = [];
  if (screenSources.length > 0) {
    screenThumbs = screenSources.map((source, index) => {
      console.log('screenSources.map:', source);
      return <img src={} alt="" key={source.id} />;
    });
  }

  return (
    <Dialog fullScreen open={pickerVisible} onClose={handleDialogClose}>
      <Box>
        <TabContext value={tabId}>
          <TabList value={tabId} variant="standard" onChange={handleTabChange}>
            <Tab value="tab1" label="Applications" />
            <Tab value="tab2" label="Screens" />
          </TabList>
          <ScreenPickerTabPanel value="tab1">
            <span>This is the Applications tab</span>
            {windowThumbs}
          </ScreenPickerTabPanel>
          <ScreenPickerTabPanel value="tab2">
            <span>This is the Screens tab</span>
            {screenThumbs}
          </ScreenPickerTabPanel>
        </TabContext>
      </Box>
      <Box>
        <Button autoFocus color="inherit" onClick={handleDialogClose}>
          close
        </Button>
      </Box>
    </Dialog>
  );
}

export default ScreenPickerDialog;
