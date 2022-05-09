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
import { useParticipant } from 'livekit-react';
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
import { setScreenShareTrackEnabled } from '../lib/ExtendedLocalParticipant';
import { ChildWindowContext } from './WindowPortal';

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
  setScreenShareTrackEnabled(localParticipant, userId, sourceId, true, options);
};

export type VideoItemValue = {
  userName: string;
  isPopout: boolean;
  isLocal: boolean;
  videoTrack: LocalTrackPublication | RemoteTrackPublication;
};

type VideoItemsObject = {
  [sid: string]: VideoItemValue;
};

function MainVideoView() {
  const dispatch = useAppDispatch();
  const { room, participants: participants2 } = useRoom();
  const localParticipant = room?.localParticipant;
  const participants = room?.participants;
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);
  const { appUser } = useAppSelector(selectAppUser);
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { groupId } = currentRoom;
  const groupInfo = useAppSelector((state) => selectGroup(state, groupId));
  const [focus, setFocus] = React.useState('');
  const [isFocusView, setIsFocusView] = React.useState(false);
  const windowRef = React.useContext(ChildWindowContext);
  const thisWindow = windowRef.current;
  const videoItems: VideoItemsObject = {};

  console.log('participants2', participants2);

  const setFocusCallback = React.useCallback((sid: string) => {
    return () => {
      setFocus(sid);
      setIsFocusView(true);
    };
  }, []);

  const escKeydownHandler = React.useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      console.log('esc keydown');
      setIsFocusView(false);
      setFocus('');
    }
  }, []);

  React.useEffect(() => {
    console.log('focus', focus, 'isFocusView', isFocusView);
  }, [focus, isFocusView]);

  React.useEffect(() => {
    if (thisWindow) {
      console.log('thisWindow', thisWindow);
      thisWindow.addEventListener('keydown', escKeydownHandler);
    }
    return () => {
      if (thisWindow) {
        thisWindow.removeEventListener('keydown', escKeydownHandler);
      }
    };
  }, [escKeydownHandler, thisWindow]);

  React.useEffect(() => {
    console.log('MainVideoView Mounted');
    return () => {
      console.log('MainVideoView Unmounted');
    };
  }, [escKeydownHandler, windowRef]);

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

  React.useEffect(() => {
    // subscribe to remote video tracks
    if (participants) {
      participants.forEach((participant) => {
        participant.videoTracks.forEach((videoTrack) => {
          if (!videoTrack.isSubscribed) {
            videoTrack.setSubscribed(true);
          }
        });
      });
    }
  }, [participants]);

  // add local video tracks to videoItems
  if (localParticipant) {
    console.log('localParticipant tracks', localParticipant?.videoTracks);
    if (localParticipant?.videoTracks) {
      localParticipant.videoTracks.forEach((videoTrack, sid) => {
        console.log('adding local participant track', sid, videoTrack);
        const userId = localParticipant.identity;
        const user = groupInfo?.users.find(
          (groupUser) => groupUser.user_id === +userId
        );
        const userName = user?.name || 'Unknown';
        const isPopout = false;
        const isLocal = true;
        videoItems[sid] = { userName, isPopout, isLocal, videoTrack };
      });
    }
  }

  // add remote video tracks to videoItems
  if (participants) {
    participants.forEach((participant) => {
      const userId = participant.identity;
      const user = groupInfo?.users.find(
        (groupUser) => groupUser.user_id === +userId
      );
      const userName = user?.name || 'Unknown';
      if (participant.videoTracks) {
        participant.videoTracks.forEach((videoTrack, sid) => {
          console.log('adding remote participant track', sid, videoTrack);
          const isPopout = false;
          const isLocal = false;
          videoItems[sid] = { userName, isPopout, isLocal, videoTrack };
        });
      }
    });
  }

  const gridBoxStyle: React.CSSProperties = {
    background: 'black',
    height: '400px',
    width: '500px',
    minWidth: '400px',
  };

  const gridBoxFocusStyle: React.CSSProperties = {
    background: 'black',
    boxSizing: 'border-box',
    maxHeight: '100%',
    maxWidth: '100%',
    padding: '0px',
  };

  const gridItemFocusStyle: React.CSSProperties = {
    padding: '0px',
  };

  const gridStyle: React.CSSProperties = {
    justifyContent: 'center',
  };

  const gridFocusStyle: React.CSSProperties = {
    justifyContent: 'center',
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    margin: '0px',
  };

  const gridItems = Object.entries(videoItems).map(([sid, videoItem]) => {
    const { userName, isPopout, isLocal, videoTrack } = videoItem;
    const isFocusItem = focus === sid;
    return (
      <Grid
        item
        key={sid}
        hidden={isFocusView && !isFocusItem}
        style={isFocusItem ? gridItemFocusStyle : {}}
      >
        <Box
          style={isFocusItem ? gridBoxFocusStyle : gridBoxStyle}
          onClick={setFocusCallback(sid)}
        >
          <VideoItem videoTrack={videoTrack} isLocal={isLocal} />
        </Box>
      </Grid>
    );
  });

  return (
    <Grid
      container
      spacing={1}
      style={isFocusView ? gridFocusStyle : gridStyle}
    >
      {gridItems}
    </Grid>
  );
}

export default MainVideoView;
