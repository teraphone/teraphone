import * as React from 'react';
import { Box, Avatar, IconButton, Tooltip, Typography } from '@mui/material';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
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
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { SerializedDesktopCapturerSource } from '../global';

function ScreenShareBanner(props: {
  source: SerializedDesktopCapturerSource;
  setSources: ActionCreatorWithPayload<ScreenSource, string>;
}) {
  const { source, setSources } = props;
  const { id, name, appIconDataURL } = source;
  const isValidIcon = appIconDataURL ? validDataURL(appIconDataURL) : false;

  return (
    <Box>
      {isValidIcon ? (
        <Avatar src={appIconDataURL as string} />
      ) : (
        <Avatar>{name[0]}</Avatar>
      )}
      <Typography variant="body2">{name}</Typography>
      <Tooltip title="Stop Sharing" placement="top" arrow>
        <IconButton onClick={() => console.log('clicked', id)}>
          <StopScreenShareIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function ScreenShareBanners() {
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);

  const screenBanners = Object.entries(screens).map(([id, source]) => (
    <ScreenShareBanner key={id} source={source} setSources={setScreens} />
  ));

  const windowBanners = Object.entries(windows).map(([id, source]) => (
    <ScreenShareBanner key={id} source={source} setSources={setWindows} />
  ));

  return (
    <Box>
      {screenBanners}
      {windowBanners}
    </Box>
  );
}

export default ScreenShareBanners;
// todo: finish this
