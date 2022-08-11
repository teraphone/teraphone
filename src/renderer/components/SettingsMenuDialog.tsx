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
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectIsVisible, setIsVisible } from '../redux/SettingsSlice';

function SettingsMenuDialog() {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector(selectIsVisible);

  React.useEffect(() => {
    console.log('SettingsMenuDialog Mounted');
    return () => console.log('SettingsMenuDialog Unmounted');
  }, []);

  const handleDialogClose = React.useCallback(() => {
    dispatch(setIsVisible(false));
  }, [dispatch]);

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
