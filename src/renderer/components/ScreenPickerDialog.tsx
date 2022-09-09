/* eslint-disable no-console */
import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Tab,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  useTheme,
} from '@mui/material';
import { TabContext, TabList, useTabContext } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setScreens,
  setWindows,
  setPickerVisible,
  selectScreens,
  selectWindows,
  selectPickerVisible,
  ScreenSource,
  validDataURL,
} from '../redux/ScreenShareSlice';
import { SerializedDesktopCapturerSource } from '../global';

function ScreenPickerItem(props: {
  source: SerializedDesktopCapturerSource;
  selected: ScreenSource;
  setSelected: React.Dispatch<React.SetStateAction<ScreenSource>>;
}) {
  const { source, selected, setSelected } = props;
  const { id, name, thumbnailDataURL } = source;
  const checked = !!selected[id];

  const toggleSelected = React.useCallback(() => {
    setSelected((prev) => {
      const { [id]: target, ...rest } = { ...prev };
      if (target) {
        return rest;
      }
      return { ...prev, [id]: source };
    });
  }, [id, setSelected, source]);

  return (
    <ImageListItem key={id}>
      <Box
        sx={{
          p: 0,
          m: 0,
          border: 3,
          borderColor: checked ? 'error.light' : 'transparent',
          backgroundColor: '#000',
          alignSelf: 'center',
          boxShadow: 0,
        }}
      >
        <Box
          sx={{
            height: '140px',
            width: '240px',
            display: 'flex',
            justifyContent: 'center',
          }}
          onClick={toggleSelected}
        >
          <img
            src={thumbnailDataURL}
            alt={name}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </Box>
      </Box>
      <ImageListItemBar
        title={name}
        position="below"
        sx={{
          width: '150px',
          overflow: 'hidden',
          alignSelf: 'center',
          textAlign: 'center',
        }}
      />
    </ImageListItem>
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
  const theme = useTheme();

  // global state
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);
  const pickerVisible = useAppSelector(selectPickerVisible);

  // local state
  const [selectedScreens, setSelectedScreens] =
    React.useState<ScreenSource>(screens);
  const [selectedWindows, setSelectedWindows] =
    React.useState<ScreenSource>(windows);
  const [screenSources, setScreenSources] = React.useState<
    SerializedDesktopCapturerSource[]
  >([]);
  const [windowSources, setwindowSources] = React.useState<
    SerializedDesktopCapturerSource[]
  >([]);
  const [tabId, setTabId] = React.useState('tab1');
  const [intervalId, setIntervalId] = React.useState<number | null>(null);

  const handleDialogClose = React.useCallback(() => {
    dispatch(setPickerVisible(false));
    setSelectedScreens(screens);
    setSelectedWindows(windows);
  }, [dispatch, screens, windows]);

  const handleClearAll = React.useCallback(() => {
    setSelectedScreens({});
    setSelectedWindows({});
  }, []);

  const handleSubmit = React.useCallback(() => {
    console.log('ScreenPickerDialog.handleSubmit');
    console.log('selectedScreens', selectedScreens);
    console.log('selectedWindows', selectedWindows);
    dispatch(setPickerVisible(false));
    dispatch(setScreens(selectedScreens));
    dispatch(setWindows(selectedWindows));
  }, [dispatch, selectedScreens, selectedWindows]);

  const handleTabChange = React.useCallback(
    (_event: React.SyntheticEvent, id: string) => {
      setTabId(id);
    },
    []
  );

  const getDisplaySources = React.useCallback(async () => {
    console.log('getDisplaySources');
    const thumbWidth = 240;
    const thumbHeight = 240;

    setScreenSources(
      await window.electron.ipcRenderer.queryScreens({
        thumbnailSize: {
          width: thumbWidth,
          height: thumbHeight,
        },
        types: ['screen'],
      })
    );

    setwindowSources(
      await window.electron.ipcRenderer.queryScreens({
        thumbnailSize: {
          width: thumbWidth,
          height: thumbHeight,
        },
        types: ['window'],
        fetchWindowIcons: true,
      })
    );
  }, []);

  React.useEffect(() => {
    console.log('ScreenPickerDialog Mounted');
    return () => console.log('ScreenPickerDialog Unmounted');
  }, []);

  React.useEffect(() => {
    setSelectedScreens(screens);
    setSelectedWindows(windows);
  }, [screens, windows]);

  React.useEffect(() => {
    if (pickerVisible) {
      console.log('ScreenPickerDialog asyncEffect');
      getDisplaySources();
      setIntervalId(window.setInterval(getDisplaySources, 2000));
    } else if (intervalId) {
      window.clearInterval(intervalId);
    }
    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
    // array-valued dependencies cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerVisible]);

  let windowThumbs: React.ReactNode[] = [];
  if (windowSources.length > 0) {
    windowThumbs = windowSources
      .sort((a, b) => (a.id > b.id ? 1 : -1))
      .map((source) => {
        if (validDataURL(source.thumbnailDataURL)) {
          return (
            <ScreenPickerItem
              key={source.id}
              source={source}
              selected={selectedWindows}
              setSelected={setSelectedWindows}
            />
          );
        }
        return null;
      });
  }

  let screenThumbs: React.ReactNode[] = [];
  if (screenSources.length > 0) {
    screenThumbs = screenSources
      .sort((a, b) => (a.id > b.id ? 1 : -1))
      .map((source) => {
        if (validDataURL(source.thumbnailDataURL)) {
          return (
            <ScreenPickerItem
              key={source.id}
              source={source}
              selected={selectedScreens}
              setSelected={setSelectedScreens}
            />
          );
        }
        return null;
      });
  }

  return (
    <TabContext value={tabId}>
      <Dialog
        open={pickerVisible}
        onClose={handleDialogClose}
        scroll="paper"
        sx={{
          '& .MuiDialog-paper': {
            flexGrow: 1,
            height: '100%',
            maxWidth: '100%',
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.custom.palette.background.secondary,
            borderBottomColor: 'divider',
            borderBottomStyle: 'solid',
            borderBottomWidth: 1,
            boxShadow: theme.custom.shadows.header,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            height: '56px',
            justifyContent: 'center',
            px: 2,
            py: 1,
          }}
        >
          <Typography
            sx={{ fontWeight: 600, fontSize: '1rem' }}
            variant="body2"
          >
            Share applications and screens with the room
          </Typography>
        </Box>
        <TabList value={tabId} variant="standard" onChange={handleTabChange}>
          <Tab value="tab1" label="Applications" />
          <Tab value="tab2" label="Screens" />
        </TabList>

        <DialogContent dividers sx={{ px: 0.5 }}>
          <ScreenPickerTabPanel value="tab1">
            <ImageList gap={1} sx={{ p: 0, m: 0 }}>
              {windowThumbs}
            </ImageList>
          </ScreenPickerTabPanel>
          <ScreenPickerTabPanel value="tab2">
            <ImageList gap={1} sx={{ p: 0, m: 0 }}>
              {screenThumbs}
            </ImageList>
          </ScreenPickerTabPanel>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: 'grey.100' }}>
          <Button autoFocus color="inherit" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button color="inherit" onClick={handleClearAll}>
            Clear All
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </TabContext>
  );
}

export default ScreenPickerDialog;
