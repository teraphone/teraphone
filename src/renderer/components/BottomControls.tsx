/* eslint-disable no-alert */
/* eslint-disable no-console */
import IconButton from '@mui/material/IconButton';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { update, ref } from 'firebase/database';
import useMute from '../hooks/useMute';
import useCurrentRoom from '../hooks/useCurrentRoom';
import useFirebase from '../hooks/useFirebase';
import useAppUser from '../hooks/useAppUser';
import useConnection from '../hooks/useConnection';
import { ConnectionState } from '../contexts/ConnectionContext';

function BottomControls() {
  const { mute, toggleMute, deafen, toggleDeafen } = useMute();
  const { currentRoom } = useCurrentRoom();
  const { database } = useFirebase();
  const { appUser } = useAppUser();
  const { connectionState } = useConnection();

  const pushUserRTInfoIfConnected = (isMuted: boolean, isDeafened: boolean) => {
    const nodeRef = ref(
      database,
      `participants/${currentRoom.groupId}/${currentRoom.roomId}/${appUser.id}`
    );
    if (connectionState === ConnectionState.Connected) {
      console.log('pushing RT node:', nodeRef);
      update(nodeRef, {
        isMuted,
        isDeafened,
        isCameraShare: false,
        isScreenShare: false,
      });
    } else {
      console.log('skip pushing RT node:', nodeRef);
    }
  };

  const MuteButton = () => {
    if (mute) {
      return (
        <Tooltip title="Unmute" placement="top" arrow>
          <IconButton
            color="primary"
            aria-label="unmute"
            component="span"
            onClick={() => {
              pushUserRTInfoIfConnected(!mute, deafen);
              toggleMute();
            }}
          >
            <MicOffIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Mute" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="mute"
          component="span"
          onClick={() => {
            pushUserRTInfoIfConnected(!mute, deafen);
            toggleMute();
          }}
        >
          <MicIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const DeafenButton = () => {
    if (deafen) {
      return (
        <Tooltip title="Undeafen" placement="top" arrow>
          <IconButton
            color="primary"
            aria-label="undeafen"
            component="span"
            onClick={() => {
              pushUserRTInfoIfConnected(mute, !deafen);
              toggleDeafen();
            }}
          >
            <HeadsetOffIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Deafen" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="deafen"
          component="span"
          onClick={() => {
            pushUserRTInfoIfConnected(mute, !deafen);
            toggleDeafen();
          }}
        >
          <HeadsetIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const MenuButton = () => {
    const handleClick = () => {
      alert('Not implemented yet.');
    };

    return (
      <Tooltip title="Settings" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="settings"
          component="span"
          onClick={handleClick}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const InfoButton = () => {
    const handleClick = () => {
      window.electron.ipcRenderer.myPing();
    };

    return (
      <Tooltip title="Info" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="info"
          component="span"
          onClick={handleClick}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Stack direction="row" alignItems="right" spacing={0}>
      <MuteButton />
      <DeafenButton />
      <MenuButton />
      {/* <InfoButton /> */}
    </Stack>
  );
}

export default BottomControls;
