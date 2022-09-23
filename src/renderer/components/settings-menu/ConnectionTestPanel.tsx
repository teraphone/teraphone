/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
import {
  setLogLevel,
  LogLevel,
  createLocalAudioTrack,
  createLocalVideoTrack,
  LivekitError,
  LocalAudioTrack,
  LocalVideoTrack,
  LocalTrack,
  LocalTrackPublication,
  MediaDeviceFailure,
  Room,
  RoomConnectOptions,
  RoomEvent,
  ConnectionError,
  UnsupportedServer,
  ConnectionState,
} from 'livekit-client';
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useCallback, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useGetConnectionTestTokenQuery } from '../../redux/api';

type TestStatus = 'waiting' | 'pending' | 'success' | 'failure';

interface TestItemProps {
  status: TestStatus;
  message: string;
  error: string;
}

const ROOM_URL = 'wss://sfu-demo.teraphone.app';

setLogLevel(LogLevel.warn);

const TestStatusItem = (props: TestItemProps) => {
  const { status, message, error } = props;

  if (status === 'waiting') {
    return null;
  }
  let icon;
  switch (status) {
    case 'success':
      icon = <DoneIcon color="success" />;
      break;
    case 'failure':
      icon = <CloseIcon color="error" />;
      break;
    default:
      icon = <CircularProgress size={24} />;
      break;
  }

  return (
    <ListItem>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={message}
        secondary={error}
        secondaryTypographyProps={{ color: 'error' }}
      />
    </ListItem>
  );
};

const ConnectionTestPanel = () => {
  const { data } = useGetConnectionTestTokenQuery();
  const [testsPending, setTestsPending] = useState(false);

  // statuses
  const [testSignalConnectionStatus, setTestSignalConnectionStatus] =
    useState<TestStatus>('waiting');
  const [testWebRTCConnectionStatus, setTestWebRTCConnectionStatus] =
    useState<TestStatus>('waiting');
  const [testConnectTURNStatus, setTestConnectTURNStatus] =
    useState<TestStatus>('waiting');
  const [testPublishAudioStatus, setTestPublishAudioStatus] =
    useState<TestStatus>('waiting');
  const [testPublishVideoStatus, setTestPublishVideoStatus] =
    useState<TestStatus>('waiting');
  const [testResumeConnectionStatus, setTestResumeConnectionStatus] =
    useState<TestStatus>('waiting');

  // error messages
  const [testSignalConnectionError, setTestSignalConnectionError] =
    useState('');
  const [testWebRTCConnectionError, setTestWebRTCConnectionError] =
    useState('');
  const [testConnectTURNError, setTestConnectTURNError] = useState('');
  const [testPublishAudioError, setTestPublishAudioError] = useState('');
  const [testPublishVideoError, setTestPublishVideoError] = useState('');
  const [testResumeConnectionError, setTestResumeConnectionError] =
    useState('');

  const resetTests = useCallback(() => {
    setTestSignalConnectionStatus('waiting');
    setTestWebRTCConnectionStatus('waiting');
    setTestConnectTURNStatus('waiting');
    setTestPublishAudioStatus('waiting');
    setTestPublishVideoStatus('waiting');
    setTestResumeConnectionStatus('waiting');

    setTestSignalConnectionError('');
    setTestWebRTCConnectionError('');
    setTestConnectTURNError('');
    setTestPublishAudioError('');
    setTestPublishVideoError('');
    setTestResumeConnectionError('');
  }, []);

  const runPhase1 = useCallback(async () => {
    const token = data?.roomToken;
    if (!token) {
      return;
    }

    // init room
    const room = new Room();
    room.on(RoomEvent.SignalConnected, () => {
      console.log(RoomEvent.SignalConnected);
      setTestSignalConnectionStatus('success');
      setTestWebRTCConnectionStatus('pending');
    });

    // connect
    const roomConnectOptions = {
      autoSubscribe: false,
    };
    try {
      setTestSignalConnectionStatus('pending');
      await room.connect(ROOM_URL, token, roomConnectOptions);
    } catch (err) {
      console.log(err);
      if (err instanceof ConnectionError) {
        if (err.message.includes('signal')) {
          setTestSignalConnectionStatus('failure');
          setTestSignalConnectionError(err.message);
        } else if (err.message.includes('timeout')) {
          setTestWebRTCConnectionStatus('failure');
          setTestWebRTCConnectionError(err.message);
        } else if (err.message.includes('cancelled')) {
          setTestWebRTCConnectionStatus('failure');
          setTestWebRTCConnectionError(err.message);
        }
      } else if (err instanceof UnsupportedServer) {
        setTestSignalConnectionStatus('failure');
        setTestSignalConnectionError(err.message);
      } else if (err instanceof LivekitError) {
        setTestSignalConnectionStatus('failure');
        setTestSignalConnectionError(err.message);
        setTestWebRTCConnectionStatus('failure');
        setTestWebRTCConnectionError(err.message);
      } else {
        console.log('unknown error:', err);
        setTestSignalConnectionStatus('failure');
        setTestSignalConnectionError('unknown error, see console for details');
        setTestWebRTCConnectionStatus('failure');
        setTestWebRTCConnectionError('unknown error, see console for details');
      }
      return;
    }
    setTestWebRTCConnectionStatus('success');

    // disconnect
    if (room.state === ConnectionState.Connected) {
      try {
        await new Promise((resolve, reject) => {
          const onDisconnect = () => {
            console.log(RoomEvent.Disconnected);
            resolve(null);
          };
          room.once(RoomEvent.Disconnected, onDisconnect);
          setTimeout(() => reject(new Error('Disconnect timed out')), 10000);
          room.disconnect(true);
        });
      } catch (err) {
        console.log('Could not disconnect cleanly:', err);
      }
    }
  }, [data?.roomToken]);

  const runPhase2 = useCallback(async () => {
    const token = data?.roomToken;
    if (!token) {
      return;
    }

    // init room
    const room = new Room();

    // connect
    const roomConnectOptions: RoomConnectOptions = {
      autoSubscribe: false,
      rtcConfig: {
        iceTransportPolicy: 'relay',
      },
    };

    try {
      setTestConnectTURNStatus('pending');
      await room.connect(ROOM_URL, token, roomConnectOptions);
    } catch (err) {
      setTestConnectTURNStatus('failure');
      if (err instanceof LivekitError) {
        setTestConnectTURNError(err.message);
      } else {
        console.log('unknown error:', err);
        setTestConnectTURNError('unknown error, see console for details');
      }
      return;
    }
    setTestConnectTURNStatus('success');

    // publish audio
    setTestPublishAudioStatus('pending');
    let audioTrack: LocalAudioTrack;
    let audioTrackPublication: LocalTrackPublication;
    try {
      audioTrack = await createLocalAudioTrack();
      audioTrackPublication = await room.localParticipant.publishTrack(
        audioTrack
      );
    } catch (err: unknown) {
      setTestPublishAudioStatus('failure');
      if (err instanceof LivekitError) {
        setTestPublishAudioError(err.message);
      } else {
        const msg = MediaDeviceFailure.getFailure(err);
        if (msg) {
          setTestPublishAudioError(msg);
        } else {
          console.log('unknown error:', err);
          setTestPublishAudioError('unknown error, see console for details');
        }
      }
      return;
    }

    if (audioTrackPublication) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        await new Promise((resolve, reject) => {
          room.once(RoomEvent.LocalTrackUnpublished, resolve);
          room.localParticipant.unpublishTrack(
            audioTrackPublication.track as LocalTrack,
            true
          );
          setTimeout(() => reject(new Error('Timed out')), 10000);
        });
      } catch (err) {
        setTestPublishAudioStatus('failure');
        setTestPublishAudioError('Timed out');
        return;
      }
    } else {
      setTestPublishAudioStatus('failure');
      return;
    }
    setTestPublishAudioStatus('success');

    // publish video
    setTestPublishVideoStatus('pending');
    let videoTrack: LocalVideoTrack;
    let videoTrackPublication: LocalTrackPublication;
    try {
      videoTrack = await createLocalVideoTrack();
      videoTrackPublication = await room.localParticipant.publishTrack(
        videoTrack
      );
    } catch (err: unknown) {
      setTestPublishVideoStatus('failure');
      if (err instanceof LivekitError) {
        setTestPublishVideoError(err.message);
      } else {
        const msg = MediaDeviceFailure.getFailure(err);
        if (msg) {
          setTestPublishVideoError(msg);
        } else {
          console.log('unknown error:', err);
          setTestPublishVideoError('unknown error, see console for details');
        }
      }
      return;
    }

    if (videoTrackPublication) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        await new Promise((resolve, reject) => {
          room.once(RoomEvent.LocalTrackUnpublished, resolve);
          room.localParticipant.unpublishTrack(
            videoTrackPublication.track as LocalTrack,
            true
          );
          setTimeout(() => reject(new Error('Timed out')), 10000);
        });
      } catch (err) {
        setTestPublishVideoStatus('failure');
        setTestPublishVideoError('Timed out');
        return;
      }
    } else {
      setTestPublishVideoStatus('failure');
      return;
    }
    setTestPublishVideoStatus('success');

    // reconnect
    try {
      await new Promise((resolve, reject) => {
        const onDisconnect = () => {
          console.log(RoomEvent.Disconnected);
          setTestResumeConnectionStatus('failure');
          setTestResumeConnectionError('could not reconnect');
          resolve(null);
        };
        const onReconnected = () => {
          console.log(RoomEvent.Reconnected);
          setTestResumeConnectionStatus('success');
          room.off(RoomEvent.Disconnected, onDisconnect);
          resolve(null);
        };
        setTestResumeConnectionStatus('pending');
        room.once(RoomEvent.Reconnected, onReconnected);
        room.once(RoomEvent.Disconnected, onDisconnect);
        room.simulateScenario('signal-reconnect');
        setTimeout(() => reject(new Error('Timed out')), 10000);
      });
    } catch (err) {
      setTestResumeConnectionStatus('failure');
      setTestResumeConnectionError('Timed out');
      return;
    }

    // disconnect
    if (room.state === ConnectionState.Connected) {
      try {
        await new Promise((resolve, reject) => {
          const onDisconnect = () => {
            console.log(RoomEvent.Disconnected);
            resolve(null);
          };
          room.once(RoomEvent.Disconnected, onDisconnect);
          setTimeout(() => reject(new Error('Disconnect timed out')), 10000);
          room.disconnect(true);
        });
      } catch (err) {
        console.log('Could not disconnect cleanly:', err);
      }
    }
  }, [data?.roomToken]);

  const runTests = useCallback(async () => {
    setTestsPending(true);
    resetTests();
    try {
      await runPhase1();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await runPhase2();
    } catch (err) {
      console.log(err);
    }
    setTestsPending(false);
  }, [resetTests, runPhase1, runPhase2]);

  return (
    <Box
      sx={{ display: 'flex', p: 0 }}
      flexDirection={{ xs: 'column', md: 'row' }}
    >
      <Box sx={{ pr: 6, pb: 3 }}>
        <Typography variant="h5" component="h1">
          Connection Test
        </Typography>
        <br />
        <Typography variant="body1">
          Test your connection to Teraphone's servers.
        </Typography>
        <br />
        <LoadingButton
          variant="contained"
          disabled={!data?.roomToken || testsPending}
          onClick={runTests}
          loading={!data?.roomToken || testsPending}
        >
          Begin Test
        </LoadingButton>
      </Box>
      <Box>
        <Typography variant="h5" component="h1">
          Results
        </Typography>
        <List>
          <TestStatusItem
            key="test-signal-connection"
            status={testSignalConnectionStatus}
            message="Connecting to signal connection via WebSocket"
            error={testSignalConnectionError}
          />
          <TestStatusItem
            key="test-webrtc-connection"
            status={testWebRTCConnectionStatus}
            message="Establishing WebRTC connection"
            error={testWebRTCConnectionError}
          />
          <TestStatusItem
            key="test-connect-turn"
            status={testConnectTURNStatus}
            message="Can connect via TURN"
            error={testConnectTURNError}
          />
          <TestStatusItem
            key="test-publish-audio"
            status={testPublishAudioStatus}
            message="Can publish audio"
            error={testPublishAudioError}
          />
          <TestStatusItem
            key="test-publish-video"
            status={testPublishVideoStatus}
            message="Can publish video"
            error={testPublishVideoError}
          />
          <TestStatusItem
            key="test-resume-connection"
            status={testResumeConnectionStatus}
            message="Resuming connection after interruption"
            error={testResumeConnectionError}
          />
        </List>
      </Box>
    </Box>
  );
};

export default ConnectionTestPanel;
