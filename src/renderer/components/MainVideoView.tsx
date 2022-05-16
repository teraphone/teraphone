/* eslint-disable no-console */
import * as React from 'react';
import {
  Room,
  RoomEvent,
  LocalParticipant,
  ScreenShareCaptureOptions,
  LocalTrackPublication,
  LocalTrack,
  VideoPresets,
  Track,
  RemoteTrackPublication,
  RemoteParticipant,
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
import { startStream } from '../lib/ExtendedLocalParticipant';
import { ChildWindowContext } from './WindowPortal';
import VideoOverlay from './VideoOverlay';
import useHideOnMouseStop from '../hooks/useHideOnMouseStop';
import { VideoItemsObject } from './VideoViews';

function MainVideoView() {
  const dispatch = useAppDispatch();
  const { room } = useRoom();
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
  const [videoItems, setVideoItems] = React.useState<VideoItemsObject>({});
  const isMounted = false;
  const [
    hideOverlay,
    onOverlayMouseEnter,
    onOverlayMouseLeave,
    onOverlayMouseMove,
  ] = useHideOnMouseStop({
    delay: 3000,
    hideCursor: true,
    initialHide: false,
    showOnlyOnContainerHover: true,
    targetDoc: thisWindow?.document,
  });

  const createSetFocusViewCallback = React.useCallback(
    (sid: string) => () => {
      console.log('got focus callback', sid);
      setFocus(sid);
      setIsFocusView(true);
    },
    [setFocus, setIsFocusView]
  );

  const handleVideoClickEvent = React.useCallback(
    (sid: string) =>
      (event: React.MouseEvent<HTMLVideoElement | HTMLElement>) => {
        console.log('handleClickEvent', event);
        const target = event.target as HTMLVideoElement | HTMLElement;
        if (target.localName === 'video') {
          setFocus(sid);
          setIsFocusView(true);
        }
      },
    []
  );

  const setGridViewCallback = React.useCallback(() => {
    setIsFocusView(false);
    setFocus('');
  }, []);

  const escKeydownHandler = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setGridViewCallback();
      }
    },
    [setGridViewCallback]
  );

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

  const setUpScreenTrack = React.useCallback(
    (
      videoTrack: RemoteTrackPublication | LocalTrackPublication,
      participant: RemoteParticipant | LocalParticipant
    ) => {
      const userId = participant.identity;
      const user = groupInfo?.users.find(
        (groupUser) => groupUser.user_id === +userId
      );
      const userName = user?.name || 'Unknown';
      const sid = videoTrack.trackSid;
      const isPopout = false;
      const isLocal = participant.sid === localParticipant?.sid;
      if (!isLocal && !videoTrack.isSubscribed) {
        (videoTrack as RemoteTrackPublication).setSubscribed(true);
      }
      setVideoItems((prev) => ({
        ...prev,
        [sid]: { userName, isPopout, isLocal, videoTrack },
      }));
    },
    [groupInfo?.users, localParticipant?.sid]
  );

  const takeDownScreenTrack = React.useCallback(
    (
      videoTrack: RemoteTrackPublication | LocalTrackPublication,
      participant: RemoteParticipant | LocalParticipant
    ) => {
      const sid = videoTrack.trackSid;
      delete videoItems[sid];
      setVideoItems(videoItems);
    },
    [videoItems]
  );

  const handleTrackPublished = React.useCallback(
    (track: RemoteTrackPublication, participant: RemoteParticipant) => {
      if (track.kind === 'video') {
        setUpScreenTrack(track, participant);
      }
    },
    [setUpScreenTrack]
  );

  const handleTrackUnpublished = React.useCallback(
    (track: RemoteTrackPublication, participant: RemoteParticipant) => {
      if (track.kind === 'video') {
        takeDownScreenTrack(track, participant);
      }
    },
    [takeDownScreenTrack]
  );

  const handleTrackUnsubscribed = React.useCallback(
    (
      _: Track,
      track: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log(RoomEvent.TrackUnsubscribed, _, track, participant);
      if (track.kind === 'video') {
        takeDownScreenTrack(track, participant);
      }
    },
    [takeDownScreenTrack]
  );

  const handleLocalTrackUnpublished = React.useCallback(
    (track: LocalTrackPublication, participant: LocalParticipant) => {
      console.log(RoomEvent.LocalTrackUnpublished, track, participant);
      if (track.kind === 'video') {
        takeDownScreenTrack(track, participant);
      }
    },
    [takeDownScreenTrack]
  );

  React.useEffect(() => {
    if (room) {
      room.on(RoomEvent.TrackPublished, handleTrackPublished);
      room.on(RoomEvent.TrackUnpublished, handleTrackUnpublished);
      room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      room.on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);
      return () => {
        room.off(RoomEvent.TrackPublished, handleTrackPublished);
        room.off(RoomEvent.TrackUnpublished, handleTrackUnpublished);
        room.off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
        room.off(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);
      };
    }
    return () => {};
  }, [
    handleTrackPublished,
    handleTrackUnpublished,
    handleTrackUnsubscribed,
    handleLocalTrackUnpublished,
    room,
  ]);

  React.useEffect(() => {
    const p: Array<Promise<void>> = [];
    if (room) {
      if (Object.keys(screens).length > 0) {
        Object.entries(screens).forEach(([sourceId, _]) => {
          p.push(
            startStream(room.localParticipant, appUser.id.toString(), sourceId)
          );
        });
      }

      if (Object.keys(windows).length > 0) {
        Object.entries(windows).forEach(([sourceId, _]) => {
          p.push(
            startStream(room.localParticipant, appUser.id.toString(), sourceId)
          );
        });
      }
    }

    Promise.all(p)
      .then(() => {
        // add local video tracks to videoItems
        if (localParticipant) {
          if (localParticipant?.videoTracks) {
            localParticipant.videoTracks.forEach((videoTrack, _sid) => {
              setUpScreenTrack(videoTrack, localParticipant);
            });
          }
        }
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }, [
    appUser.id,
    groupInfo?.users,
    localParticipant,
    room,
    screens,
    setUpScreenTrack,
    windows,
  ]);

  React.useEffect(() => {
    // add remote video tracks to videoItems
    if (participants) {
      participants.forEach((participant) => {
        if (participant.videoTracks) {
          participant.videoTracks.forEach((videoTrack, _sid) => {
            setUpScreenTrack(videoTrack, participant);
          });
        }
      });
    }
  }, [groupInfo?.users, participants, setUpScreenTrack]);

  const gridBoxStyle: React.CSSProperties = {
    background: 'black',
    height: '400px',
    width: '500px',
    minWidth: '400px',
    position: 'relative',
  };

  const gridBoxFocusStyle: React.CSSProperties = {
    background: 'black',
    boxSizing: 'border-box',
    maxHeight: '100%',
    maxWidth: '100%',
    padding: '0px',
    position: 'relative',
  };

  const gridItemFocusStyle: React.CSSProperties = {
    padding: '0px',
  };

  const gridStyle: React.CSSProperties = {
    justifyContent: 'center',
    position: 'relative',
  };

  const gridFocusStyle: React.CSSProperties = {
    justifyContent: 'center',
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    margin: '0px',
    position: 'relative',
  };

  const focusVideoItem = videoItems[focus];

  const gridItems = Object.entries(videoItems).map(([sid, videoItem]) => {
    const { userName, isPopout, isLocal, videoTrack } = videoItem;
    const isFocusItem = focus === sid;
    const sourceType = videoTrack.source;
    return (
      <Grid
        item
        key={sid}
        hidden={isFocusView && !isFocusItem}
        style={isFocusItem ? gridItemFocusStyle : {}}
      >
        <Box
          style={isFocusItem ? gridBoxFocusStyle : gridBoxStyle}
          onClick={handleVideoClickEvent(sid)}
        >
          <VideoItem videoTrack={videoTrack} isLocal={isLocal} />
          <VideoOverlay
            isFocusItem={isFocusItem}
            userName={userName}
            isPopout={isPopout}
            isLocal={isLocal}
            sourceType={sourceType}
            hidden={isFocusView}
            setFocusViewCallback={createSetFocusViewCallback(sid)}
          />
        </Box>
      </Grid>
    );
  });

  return (
    <Grid
      container
      spacing={1}
      style={isFocusView ? gridFocusStyle : gridStyle}
      onMouseEnter={isFocusView ? onOverlayMouseEnter : () => {}}
      onMouseLeave={isFocusView ? onOverlayMouseLeave : () => {}}
      onMouseMove={isFocusView ? onOverlayMouseMove : () => {}}
    >
      <VideoOverlay // attach to grid container (if focus view)
        isFocusItem
        userName={focusVideoItem?.userName}
        isPopout={focusVideoItem?.isPopout}
        isLocal={focusVideoItem?.isLocal}
        sourceType={focusVideoItem?.videoTrack.source}
        hidden={!isFocusView || hideOverlay}
        setGridViewCallback={setGridViewCallback}
      />
      {gridItems}
    </Grid>
  );
}

export default MainVideoView;
