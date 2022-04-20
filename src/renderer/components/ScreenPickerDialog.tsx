/* eslint-disable no-console */
import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Stack, Tab, Typography } from '@mui/material';
import { TabContext, TabList, useTabContext } from '@mui/lab';
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

function ScreenPickerItem(props: { source: SerializedDesktopCapturerSource }) {
  const { source } = props;
  const {
    id,
    name,
    thumbnailDataURL,
    display_id: displayId,
    appIconDataURL,
  } = source;
  const [checked, setChecked] = React.useState(false);
  // displays the name, image, id, and checkbox
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      overflow="hidden"
      onClick={() => {
        setChecked(!checked);
        console.log('clicked source:', id);
      }}
    >
      <Box>
        <Checkbox
          checked={checked}
          onChange={(event) => {
            setChecked(event.target.checked);
          }}
        />
      </Box>

      <Box
        sx={{
          boxShadow: 2,
          border: 1,
          borderColor: '#ccc',
        }}
      >
        <img src={thumbnailDataURL} alt={name} width="150px" />
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center">
        {appIconDataURL && (
          <Box ml={1}>
            <img src={appIconDataURL} alt="app-icon" height="32" width="32" />
          </Box>
        )}
        <Typography ml={1} variant="caption">
          {name}
        </Typography>
      </Box>
    </Box>
  );
}

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
      const thumbWidth = 300;
      const thumbHeight = 300;
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
          fetchWindowIcons: true,
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
    windowThumbs = windowSources
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
      .map((source) => {
        if (source.thumbnailDataURL) {
          return <ScreenPickerItem source={source} key={source.id} />;
        }
        return null;
      });
  }

  let screenThumbs: React.ReactNode[] = [];
  if (screenSources.length > 0) {
    screenThumbs = screenSources.map((source) => {
      if (source.thumbnailDataURL) {
        return <ScreenPickerItem source={source} key={source.id} />;
      }
      return null;
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
        <DialogTitle sx={{ alignSelf: 'center' }}>Screen Share</DialogTitle>
        <Typography variant="body1" align="center" sx={{ px: 2 }}>
          Select the Applications and Screens that you would like to share with
          the room!
        </Typography>
        <TabList value={tabId} variant="standard" onChange={handleTabChange}>
          <Tab value="tab1" label="Applications" />
          <Tab value="tab2" label="Screens" />
        </TabList>

        <DialogContent dividers sx={{ px: 0.5 }}>
          <ScreenPickerTabPanel value="tab1">
            <Stack spacing={2} divider={<Divider />}>
              {windowThumbs}
            </Stack>
          </ScreenPickerTabPanel>
          <ScreenPickerTabPanel value="tab2">
            <Stack spacing={2} divider={<Divider />}>
              {screenThumbs}
            </Stack>
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
