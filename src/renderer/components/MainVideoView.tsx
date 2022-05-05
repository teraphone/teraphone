/* eslint-disable no-console */
import * as React from 'react';
import {
  Room,
  LocalParticipant,
  ScreenShareCaptureOptions,
  ScreenSharePresets,
  LocalTrackPublication,
  LocalTrack,
  VideoPresets,
  Track,
  RemoteTrackPublication,
} from 'livekit-client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { VideoRenderer } from './VideoRenderer';
import { VideoItem } from './VideoItem';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setScreens,
  setWindows,
  setPickerVisible,
  selectScreens,
  selectWindows,
  selectPickerVisible,
  ScreenSource,
} from '../redux/ScreenShareSlice';
import useRoom from '../hooks/useRoom';
import { selectAppUser } from '../redux/AppUserSlice';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import { selectGroup } from '../redux/WorldSlice';

const startStream = (
  localParticipant: LocalParticipant,
  userId: string,
  sourceId: string
) => {
  console.log('starting stream', sourceId);
  const options: ScreenShareCaptureOptions = {
    audio: false,
    resolution: ScreenSharePresets.h1080fps15,
  };
  localParticipant.setScreenShareTrackEnabled(userId, sourceId, true, options);
};

export type VideoItemValue = {
  userName: string;
  isPopout: boolean;
  isLocal: boolean;
  videoTrack: LocalTrackPublication | RemoteTrackPublication;
};

function MainVideoView() {
  const dispatch = useAppDispatch();
  const { room } = useRoom();
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);
  const { appUser } = useAppSelector(selectAppUser);
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { groupId } = currentRoom;
  const groupInfo = useAppSelector((state) => selectGroup(state, groupId));
  const videoItems = new Map<string, VideoItemValue>();
  const [focus, setFocus] = React.useState('');
  const [isFocusView, setIsFocusView] = React.useState(false);

  const setFocusCallback = React.useCallback((sid: string) => {
    setFocus(sid);
  }, []);

  React.useEffect(() => {
    console.log('MainVideoView Mounted');
    return () => {
      console.log('MainVideoView Unmounted');
    };
  }, []);

  React.useEffect(() => {
    if (room) {
      if (Object.keys(screens).length > 0) {
        Object.entries(screens).forEach(([sourceId, _]) => {
          startStream(room.localParticipant, appUser.id.toString(), sourceId);
        });
      }

      if (Object.keys(windows).length > 0) {
        Object.entries(windows).forEach(([sourceId, _]) => {
          startStream(room.localParticipant, appUser.id.toString(), sourceId);
        });
      }
    }
    console.log('localParticipant', room?.localParticipant);
  }, [appUser.id, room, screens, windows]);

  // subscribe to remote video tracks
  if (room?.participants) {
    room.participants.forEach((participant) => {
      participant.videoTracks.forEach((videoTrack) => {
        if (!videoTrack.isSubscribed) {
          videoTrack.setSubscribed(true);
        }
      });
    });
  }

  // add local video tracks to videoItems
  if (room?.localParticipant?.videoTracks) {
    room.localParticipant.videoTracks.forEach((videoTrack, sid) => {
      const userId = room.localParticipant.identity;
      const user = groupInfo?.users.find(
        (groupUser) => groupUser.user_id === +userId
      );
      const userName = user?.name || 'Unknown';
      const isPopout = false;
      const isLocal = true;
      videoItems.set(sid, { userName, isPopout, isLocal, videoTrack });
    });
  }

  // add remote video tracks to videoItems
  if (room?.participants) {
    room.participants.forEach((participant) => {
      const userId = participant.identity;
      const user = groupInfo?.users.find(
        (groupUser) => groupUser.user_id === +userId
      );
      const userName = user?.name || 'Unknown';
      if (participant.videoTracks) {
        participant.videoTracks.forEach((videoTrack, sid) => {
          const isPopout = false;
          const isLocal = false;
          videoItems.set(sid, { userName, isPopout, isLocal, videoTrack });
        });
      }
    });
  }

  // Todo: finish this
  console.log('videoItems', videoItems);
  const gridItems = [] as JSX.Element[];
  videoItems.forEach((videoItem) => {
    const { userName, isPopout, isLocal, videoTrack } = videoItem;
    gridItems.push(
      <Grid item key={videoTrack.trackSid}>
        <VideoItem videoTrack={videoTrack} isLocal={isLocal} />
      </Grid>
    );
  });

  return (
    <Grid container hidden={!isFocusView}>
      {gridItems}
    </Grid>
  );
}

export default MainVideoView;
