/* eslint-disable no-console */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectIsVisible, setIsVisible } from '../redux/SettingsSlice';
import useRoom from '../hooks/useRoom';
import { signedOut } from '../redux/ArtySlice';

function SettingsMenuDialog() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isVisible = useAppSelector(selectIsVisible);
  const { room } = useRoom();

  React.useEffect(() => {
    console.log('SettingsMenuDialog Mounted');
    return () => console.log('SettingsMenuDialog Unmounted');
  }, []);

  const handleDialogClose = React.useCallback(() => {
    dispatch(setIsVisible(false));
  }, [dispatch]);

  const handleSignOut = React.useCallback(() => {
    room?.disconnect().catch(console.error);
    dispatch(signedOut);
    window.electron.ipcRenderer.logout().catch(console.error);
    dispatch(setIsVisible(false));
    navigate('/');
  }, [dispatch, navigate, room]);

  return (
    <Dialog
      fullScreen
      open={isVisible}
      onClose={handleDialogClose}
      scroll="paper"
    >
      <DialogTitle sx={{ alignSelf: 'center' }}>Settings</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">Some text.</Typography>
        <Button variant="contained" color="error" onClick={handleSignOut}>
          Sign Out
        </Button>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="inherit" onClick={handleDialogClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsMenuDialog;
