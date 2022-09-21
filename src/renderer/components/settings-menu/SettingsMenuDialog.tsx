/* eslint-disable no-console */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import {
  Avatar,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Typography,
} from '@mui/material';
import { TabContext, TabList, useTabContext } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { Room } from 'livekit-client';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectIsVisible,
  selectSelectedSpeakerId,
  selectSelectedMicrophoneId,
  setIsVisible,
  setSelectedSpeakerId,
  setSelectedMicrophoneId,
} from '../../redux/SettingsSlice';
import useRoom from '../../hooks/useRoom';
import { signedOut } from '../../redux/ArtySlice';
import { selectAppUser } from '../../redux/AppUserSlice';
import { selectUserAvatars } from '../../redux/AvatarSlice';

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
      sx={{
        px: 4,
        py: 1.5,
      }}
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
    navigate('/?signedOut');
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

type DeviceCatalog = {
  [key in MediaDeviceKind]: MediaDeviceInfo[];
};

async function getDevices() {
  const deviceCatalog = {} as DeviceCatalog;
  try {
    deviceCatalog.audioinput = await Room.getLocalDevices('audioinput', true);
    deviceCatalog.audiooutput = await Room.getLocalDevices('audiooutput', true);
    deviceCatalog.videoinput = await Room.getLocalDevices('videoinput', true);
  } catch (error) {
    console.error(error);
  }
  return deviceCatalog;
}

function DevicesPanel() {
  const dispatch = useAppDispatch();
  const selectedSpeakerId = useAppSelector(selectSelectedSpeakerId);
  const selectedMicrophoneId = useAppSelector(selectSelectedMicrophoneId);
  const { room } = useRoom();
  const [devices, setDevices] = React.useState({
    audioinput: [],
    audiooutput: [],
    videoinput: [],
  } as DeviceCatalog);
  const currentSpeaker =
    selectedSpeakerId === ''
      ? devices.audiooutput[0]
      : devices.audiooutput.find((d) => d.deviceId === selectedSpeakerId);
  const currentMicrophone =
    selectedMicrophoneId === ''
      ? devices.audioinput[0]
      : devices.audioinput.find((d) => d.deviceId === selectedMicrophoneId);
  // todo:
  // - make sure selected devices exist. if not, select default.
  // - option to set to system default
  // - persist selectedSpeakerId and selectedMicrophoneId

  React.useEffect(() => {
    getDevices()
      .then((d) => setDevices(d))
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    if (currentSpeaker) {
      room?.switchActiveDevice('audiooutput', currentSpeaker.deviceId);
    }
  }, [currentSpeaker, room]);

  React.useEffect(() => {
    if (currentMicrophone) {
      room?.switchActiveDevice('audioinput', currentMicrophone.deviceId);
      if (room?.options.audioCaptureDefaults) {
        room.options.audioCaptureDefaults.deviceId = currentMicrophone.deviceId;
      }
    }
  }, [currentMicrophone, room]);

  const handleSpeakerChange = React.useCallback(
    (event: SelectChangeEvent) => {
      dispatch(setSelectedSpeakerId(event.target.value));
    },
    [dispatch]
  );

  const handleMicrophoneChange = React.useCallback(
    (event: SelectChangeEvent) => {
      dispatch(setSelectedMicrophoneId(event.target.value));
    },
    [dispatch]
  );

  return (
    <>
      <Typography variant="h5">Your Devices</Typography>
      <br />
      <Typography variant="h6">Audio Devices</Typography>
      <Box sx={{ pt: 2 }}>
        <FormControl fullWidth variant="standard">
          {devices.audiooutput.length > 0 && (
            <>
              <InputLabel>Speaker</InputLabel>
              <Select
                value={currentSpeaker?.deviceId}
                label={currentSpeaker?.label}
                onChange={handleSpeakerChange}
              >
                {devices.audiooutput.map((d) => (
                  <MenuItem key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
          {devices.audiooutput.length === 0 && (
            <Typography variant="body2">
              No audio output devices found.
            </Typography>
          )}
        </FormControl>
      </Box>
      <Box sx={{ pt: 2 }}>
        <FormControl fullWidth variant="standard">
          {devices.audioinput.length > 0 && (
            <>
              <InputLabel>Microphone</InputLabel>
              <Select
                value={currentMicrophone?.deviceId}
                label={currentMicrophone?.label}
                onChange={handleMicrophoneChange}
              >
                {devices.audioinput.map((d) => (
                  <MenuItem key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
          {devices.audioinput.length === 0 && (
            <Typography variant="body2">
              No audio input devices found.
            </Typography>
          )}
        </FormControl>
      </Box>
    </>
  );
}

function LicensePanel() {
  const { tenantUser: user, subscription } = useAppSelector(selectAppUser);
  const hasSubscription = user.subscriptionId !== '';

  return (
    <>
      <Typography variant="h5">User</Typography>
      <br />
      <Typography variant="h6">Email</Typography>
      <Typography variant="body1">{user.email}</Typography>
      <br />
      <Typography variant="h6">Tenant ID</Typography>
      <Typography variant="body1">{user.tid}</Typography>
      <br />
      <Typography variant="h6">User ID</Typography>
      <Typography variant="body1">{user.oid}</Typography>
      <br />
      <Typography variant="h5">Trial</Typography>
      <br />
      <Typography variant="h6">Trial Activated</Typography>
      <Typography variant="body1">
        {user.trialActivated ? 'True' : 'False'}
      </Typography>
      <br />
      <Typography variant="h6">Trial Expiration</Typography>
      <Typography variant="body1">{user.trialExpiresAt}</Typography>
      <br />
      {hasSubscription && (
        <>
          <Typography variant="h5">Subscription</Typography>
          <br />
          <Typography variant="h6">Auto Renew</Typography>
          <Typography variant="body1">{subscription.autoRenew}</Typography>
          <br />
          <Typography variant="h6">Beneficiary Email</Typography>
          <Typography variant="body1">
            {subscription.beneficiaryEmail}
          </Typography>
          <br />
          <Typography variant="h6">ID</Typography>
          <Typography variant="body1">{subscription.id}</Typography>
          <br />
          <Typography variant="h6">Name</Typography>
          <Typography variant="body1">{subscription.name}</Typography>
          <br />
          <Typography variant="h6">Offer ID</Typography>
          <Typography variant="body1">{subscription.offerId}</Typography>
          <br />
          <Typography variant="h6">Plan Id</Typography>
          <Typography variant="body1">{subscription.planId}</Typography>
          <br />
          <Typography variant="h6">Purchaser Email</Typography>
          <Typography variant="body1">{subscription.purchaserEmail}</Typography>
          <br />
          <Typography variant="h6">Quantity</Typography>
          <Typography variant="body1">{subscription.quantity}</Typography>
          <br />
          <Typography variant="h6">Subscription Status</Typography>
          <Typography variant="body1">
            {subscription.saasSubscriptionStatus}
          </Typography>
          <br />
          <Typography variant="h6">Subscription Term Start Date</Typography>
          <Typography variant="body1">
            {subscription.subscriptionTermStartDate}
          </Typography>
          <br />
          <Typography variant="h6">Subscription Term End Date</Typography>
          <Typography variant="body1">
            {subscription.subscriptionTermEndDate}
          </Typography>
        </>
      )}
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
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              height: '100%',
              width: '100%',
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
              }}
            >
              <Tab value="tab1" label="Account" />
              <Tab value="tab2" label="Devices" />
              <Tab value="tab3" label="License" />
            </TabList>
            <Box sx={{ height: '100%', overflowY: 'auto', flexGrow: 1 }}>
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
