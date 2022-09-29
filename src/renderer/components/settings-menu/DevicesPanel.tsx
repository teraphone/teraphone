/* eslint-disable no-console */
import * as React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectSelectedSpeakerId,
  selectSelectedMicrophoneId,
  setSelectedSpeakerId,
  setSelectedMicrophoneId,
} from '../../redux/SettingsSlice';
import useRoom from '../../hooks/useRoom';

type DeviceCatalog = {
  [key in MediaDeviceKind]: MediaDeviceInfo[];
};

async function getDevices() {
  const deviceCatalog = {} as DeviceCatalog;

  try {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    deviceCatalog.audioinput = allDevices.filter(
      (d) => d.kind === 'audioinput'
    );
    deviceCatalog.audiooutput = allDevices.filter(
      (d) => d.kind === 'audiooutput'
    );
    deviceCatalog.videoinput = allDevices.filter(
      (d) => d.kind === 'videoinput'
    );
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

export default DevicesPanel;
