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
  Avatar,
} from '@mui/material';
import { TabContext, TabList, useTabContext } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectIsVisible, setIsVisible } from '../redux/SettingsSlice';
import useRoom from '../hooks/useRoom';
import { signedOut } from '../redux/ArtySlice';
import { selectAppUser, selectUserLicense } from '../redux/AppUserSlice';
import { selectUserAvatars } from '../redux/AvatarSlice';

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
    <Box
      sx={{ px: 4, py: 1.5, borderLeft: 1, borderColor: 'divider' }}
      hidden={tabId !== id}
    >
      {children}
    </Box>
  );
}

function AccountPanel() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { room } = useRoom();
  const { tenantUser: user } = useAppSelector(selectAppUser);
  const userAvatars = useAppSelector(selectUserAvatars);

  const handleSignOut = React.useCallback(() => {
    room?.disconnect().catch(console.error);
    dispatch(signedOut);
    window.electron.ipcRenderer.logout().catch(console.error);
    dispatch(setIsVisible(false));
    navigate('/');
  }, [dispatch, navigate, room]);

  return (
    <>
      <Typography variant="h5">Your Account</Typography>
      <br />

      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Avatar
          src={userAvatars[user.oid]}
          alt={user.name}
          sx={{ height: 64, width: 64 }}
        >
          {user.name}
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2">{user.email}</Typography>
          <Button
            sx={{ my: 4 }}
            variant="contained"
            color="error"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>
      </Box>
    </>
  );
}

function DevicesPanel() {
  return <Typography variant="body1">Devices</Typography>;
}

function LicensePanel() {
  const userLicense = useAppSelector(selectUserLicense);
  const licensePlanMap: { [code: number]: string } = {
    0: 'Standard',
    1: 'Professional',
    2: 'unknown',
  };
  const licenseStatusMap: { [code: number]: string } = {
    0: 'Inactive',
    1: 'Suspended',
    2: 'Pending',
    3: 'Active',
    4: 'unknown',
  };

  return (
    <>
      <Typography variant="h5">Your License</Typography>
      <br />
      <Typography variant="h6">User ID</Typography>
      <Typography variant="body1">{userLicense.oid}</Typography>
      <br />
      <Typography variant="h6">Tenant ID</Typography>
      <Typography variant="body1">{userLicense.tid}</Typography>
      <br />
      <Typography variant="h6">License Plan</Typography>
      <Typography variant="body1">
        {licensePlanMap[userLicense.licensePlan]}
      </Typography>
      <br />
      <Typography variant="h6">License Status</Typography>
      <Typography variant="body1">
        {licenseStatusMap[userLicense.licenseStatus]}
      </Typography>
      <br />
      <Typography variant="h6">License Expiration</Typography>
      <Typography variant="body1">{userLicense.licenseExpiresAt}</Typography>
      <br />
      <Typography variant="h6">Trial Activated</Typography>
      <Typography variant="body1">
        {userLicense.trialActivated ? 'True' : 'False'}
      </Typography>
      <br />
      <Typography variant="h6">Trial Expiration</Typography>
      <Typography variant="body1">{userLicense.trialExpiresAt}</Typography>
      <br />
    </>
  );
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
            }}
          >
            <TabList
              value={tabId}
              variant="standard"
              orientation="vertical"
              onChange={handleTabChange}
            >
              <Tab value="tab1" label="Account" />
              <Tab value="tab2" label="Devices" />
              <Tab value="tab3" label="License" />
            </TabList>
            <SettingsMenuTabPanel value="tab1">
              <AccountPanel />
            </SettingsMenuTabPanel>
            <SettingsMenuTabPanel value="tab2">
              <DevicesPanel />
            </SettingsMenuTabPanel>
            <SettingsMenuTabPanel value="tab3">
              <LicensePanel />
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
