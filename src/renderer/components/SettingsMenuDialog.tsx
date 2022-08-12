/* eslint-disable no-console */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Typography,
} from '@mui/material';
import { TabContext, TabList, useTabContext } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectIsVisible, setIsVisible } from '../redux/SettingsSlice';
import useRoom from '../hooks/useRoom';
import { signedOut } from '../redux/ArtySlice';

function SettingsMenuTabPanel(props: {
  children: React.ReactNode;
  value: string;
}) {
  const { children, value: id } = props;
  const context = useTabContext();
  if (context === null) {
    throw new TypeError('No TabContext provided');
  }
  const tabId = context.value;
  return (
    <Box sx={{ px: 4, py: 1.5 }} hidden={tabId !== id}>
      {children}
    </Box>
  );
}

function AccountPanel() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { room } = useRoom();

  const handleSignOut = React.useCallback(() => {
    room?.disconnect().catch(console.error);
    dispatch(signedOut);
    window.electron.ipcRenderer.logout().catch(console.error);
    dispatch(setIsVisible(false));
    navigate('/');
  }, [dispatch, navigate, room]);

  return (
    <>
      <Typography variant="body1">
        Disconnect and sign out of Teraphone.
      </Typography>
      <Button variant="contained" color="error" onClick={handleSignOut}>
        Sign Out
      </Button>
    </>
  );
}

function DevicesPanel() {
  return <Typography variant="body1">Devices</Typography>;
}

function SettingsMenuDialog() {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector(selectIsVisible);
  const [tabId, setTabId] = React.useState('tab1');

  React.useEffect(() => {
    console.log('SettingsMenuDialog Mounted');
    return () => console.log('SettingsMenuDialog Unmounted');
  }, []);

  const handleTabChange = React.useCallback(
    (_event: React.SyntheticEvent, id: string) => {
      setTabId(id);
    },
    []
  );

  const handleDialogClose = React.useCallback(() => {
    dispatch(setIsVisible(false));
  }, [dispatch]);

  return (
    <TabContext value={tabId}>
      <Dialog
        fullScreen
        open={isVisible}
        onClose={handleDialogClose}
        scroll="paper"
      >
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          Settings
        </DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              height: '100%',
            }}
          >
            <TabList
              value={tabId}
              variant="standard"
              orientation="vertical"
              onChange={handleTabChange}
              sx={{
                borderRight: 1,
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Tab value="tab1" label="Account" />
              <Tab value="tab2" label="Devices" />
            </TabList>
            <SettingsMenuTabPanel value="tab1">
              <AccountPanel />
            </SettingsMenuTabPanel>
            <SettingsMenuTabPanel value="tab2">
              <DevicesPanel />
            </SettingsMenuTabPanel>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Button autoFocus color="inherit" onClick={handleDialogClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </TabContext>
  );
}

export default SettingsMenuDialog;
