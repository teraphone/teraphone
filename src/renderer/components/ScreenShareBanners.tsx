import * as React from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import CloseIcon from '@mui/icons-material/Close';
import {
  removeScreen,
  removeWindow,
  selectScreens,
  selectWindows,
  validDataURL,
} from '../redux/ScreenShareSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { SerializedDesktopCapturerSource } from '../global';

function ScreenShareBanner(props: {
  source: SerializedDesktopCapturerSource;
  removeSource: ActionCreatorWithPayload<string, string>;
}) {
  const { source, removeSource } = props;
  const { id, name, appIconDataURL } = source;
  const dispatch = useAppDispatch();
  const isValidIcon = appIconDataURL ? validDataURL(appIconDataURL) : false;
  const avatarDim = '24px';

  const handleClose = React.useCallback(() => {
    dispatch(removeSource(id));
  }, [dispatch, id, removeSource]);

  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{
        py: '2px',
        pr: '40px',
      }}
      secondaryAction={
        <Box
          sx={{
            pr: '8px',
          }}
        >
          <Tooltip title="Stop Sharing" placement="right" arrow>
            <IconButton
              size="small"
              aria-label="stop-sharing"
              component="span"
              onClick={handleClose}
            >
              <CloseIcon
                sx={{
                  color: 'black',
                }}
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <ListItemAvatar sx={{ minWidth: 0, margin: '4px' }}>
        {isValidIcon ? (
          <Avatar
            sx={{ height: avatarDim, width: avatarDim }}
            variant="square"
            src={appIconDataURL as string}
          />
        ) : (
          <Avatar
            sx={{
              height: avatarDim,
              width: avatarDim,
              fontSize: '14',
            }}
            variant="square"
          >
            {name[0]}
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={name}
        primaryTypographyProps={{
          variant: 'body2',
          noWrap: true,
          sx: {
            fontSize: 12,
          },
        }}
      />
    </ListItem>
  );
}

function ScreenShareBanners() {
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);

  const screenBanners = Object.entries(screens).map(([id, source]) => (
    <ScreenShareBanner key={id} source={source} removeSource={removeScreen} />
  ));

  const windowBanners = Object.entries(windows).map(([id, source]) => (
    <ScreenShareBanner key={id} source={source} removeSource={removeWindow} />
  ));

  return (
    <List dense sx={{ boxSizing: 'border-box', py: 0 }}>
      {screenBanners}
      {windowBanners}
    </List>
  );
}

export default ScreenShareBanners;
