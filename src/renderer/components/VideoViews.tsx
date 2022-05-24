/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import * as React from 'react';
import {
  LocalParticipant,
  LocalTrackPublication,
  RemoteTrackPublication,
  RemoteParticipant,
  Track,
  RoomEvent,
  RoomState,
} from 'livekit-client';
import useRoom from '../hooks/useRoom';
import WindowPortal from './WindowPortal';
import MainVideoView, { VideoItemsObject } from './MainVideoView';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWindowOpen, setWindowOpen } from '../redux/VideoViewSlice';
import { selectGroup } from '../redux/WorldSlice';
import { selectAppUser } from '../redux/AppUserSlice';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import {
  selectScreens,
  selectWindows,
  setScreens,
  setWindows,
} from '../redux/ScreenShareSlice';
import { startStream } from '../lib/ExtendedLocalParticipant';
import PopoutVideoView from './PopoutVideoView';

function VideoViews() {
  const dispatch = useAppDispatch();
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);
  const videoViewWindowOpen = useAppSelector(selectWindowOpen);
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { groupId } = currentRoom;
  const groupInfo = useAppSelector((state) => selectGroup(state, groupId));
  const { appUser } = useAppSelector(selectAppUser);
  const [videoItems, setVideoItems] = React.useState<VideoItemsObject>({});
  const { room } = useRoom();
  const localParticipant = room?.localParticipant;
  const participants = room?.participants;

  React.useEffect(() => {
    console.log('VideoViews Mounted');
    return () => {
      console.log('VideoViews Unmounted');
    };
  }, []);

  React.useEffect(() => {
    console.log('videoItems', videoItems);
  }, [videoItems]);

  const handleCloseVideoView = React.useCallback(() => {
    dispatch(setWindowOpen(false));
  }, [dispatch]);

  const setUpScreenTrack = React.useCallback(
    (
      videoTrack: RemoteTrackPublication | LocalTrackPublication,
      participant: RemoteParticipant | LocalParticipant
    ) => {
      const sid = videoTrack.trackSid;
      if (videoItems[sid]) {
        return;
      }
      const userId = participant.identity;
      const user = groupInfo?.users.find(
        (groupUser) => groupUser.user_id === +userId
      );
      const userName = user?.name || 'Unknown';
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
    [groupInfo?.users, localParticipant?.sid, videoItems]
  );

  const takeDownScreenTrack = React.useCallback(
    (
      videoTrack: RemoteTrackPublication | LocalTrackPublication,
      _participant: RemoteParticipant | LocalParticipant
    ) => {
      setVideoItems((prev) => {
        const { [videoTrack.trackSid]: removed, ...rest } = prev;
        return rest;
      });
    },
    []
  );

  const unShareScreen = React.useCallback(
    (sourceId: string) => {
      if (screens[sourceId]) {
        const { [sourceId]: removed, ...rest } = screens;
        dispatch(setScreens(rest));
      } else if (windows[sourceId]) {
        const { [sourceId]: removed, ...rest } = windows;
        dispatch(setWindows(rest));
      }
    },
    [dispatch, screens, windows]
  );

  const setIsPopout = React.useCallback((sid: string, isPopout: boolean) => {
    setVideoItems((prev) => ({
      ...prev,
      [sid]: { ...prev[sid], isPopout },
    }));
  }, []);

  const sourceIsPublished = React.useCallback(
    (trySourceId: string) => {
      let isPublished = false;
      Object.entries(videoItems)
        .filter(([, videoItem]) => videoItem.isLocal)
        .forEach(([, videoItem]) => {
          const { trackName } = videoItem.videoTrack;
          const sourceId = trackName.split('/')[1];
          if (sourceId === trySourceId) {
            isPublished = true;
          }
        });
      return isPublished;
    },
    [videoItems]
  );

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
  }, [participants, setUpScreenTrack]);

  React.useEffect(() => {
    // add local video tracks to videoItems
    const p: Array<Promise<void>> = [];
    if (room?.state === RoomState.Connected) {
      if (Object.keys(screens).length > 0) {
        Object.entries(screens).forEach(([sourceId, _]) => {
          if (!sourceIsPublished(sourceId)) {
            p.push(
              startStream(
                room.localParticipant,
                appUser.id.toString(),
                sourceId
              )
            );
          }
        });
      }

      if (Object.keys(windows).length > 0) {
        Object.entries(windows).forEach(([sourceId, _]) => {
          if (!sourceIsPublished(sourceId)) {
            p.push(
              startStream(
                room.localParticipant,
                appUser.id.toString(),
                sourceId
              )
            );
          }
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
    localParticipant,
    room,
    screens,
    setUpScreenTrack,
    sourceIsPublished,
    windows,
  ]);

  React.useEffect(() => {
    // unpublish local video tracks
    if (localParticipant) {
      if (localParticipant.videoTracks) {
        localParticipant.videoTracks.forEach((videoTrack) => {
          const { trackName, track } = videoTrack;
          const sourceId = trackName.split('/')[1];
          if (!screens[sourceId] && !windows[sourceId] && track) {
            takeDownScreenTrack(videoTrack, localParticipant);
            localParticipant.unpublishTrack(track, true);
          }
        });
      }
    }
  }, [localParticipant, screens, takeDownScreenTrack, windows]);

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
        const { trackName } = track;
        const sourceId = trackName.split('/')[1];
        unShareScreen(sourceId);
        takeDownScreenTrack(track, participant);
      }
    },
    [takeDownScreenTrack, unShareScreen]
  );

  const handleDisconnected = React.useCallback(() => {
    console.log(RoomEvent.Disconnected);
    dispatch(setScreens({}));
    dispatch(setWindows({}));
    dispatch(setWindowOpen(false));
  }, [dispatch]);

  React.useEffect(() => {
    if (room) {
      room.on(RoomEvent.TrackPublished, handleTrackPublished);
      room.on(RoomEvent.TrackUnpublished, handleTrackUnpublished);
      room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      room.on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);
      room.on(RoomEvent.Disconnected, handleDisconnected);
      return () => {
        room.off(RoomEvent.TrackPublished, handleTrackPublished);
        room.off(RoomEvent.TrackUnpublished, handleTrackUnpublished);
        room.off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
        room.off(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);
        room.off(RoomEvent.Disconnected, handleDisconnected);
      };
    }
    return () => {};
  }, [
    handleTrackPublished,
    handleTrackUnpublished,
    handleTrackUnsubscribed,
    handleLocalTrackUnpublished,
    handleDisconnected,
    room,
  ]);

  const popoutWindowNodes = Object.entries(videoItems)
    .filter(([, videoItem]) => videoItem.isPopout)
    .map(([sid, videoItem]) => {
      return (
        <PopoutVideoView
          key={sid}
          sid={sid}
          videoItem={videoItem}
          setIsPopout={setIsPopout}
        />
      );
    });

  return (
    <>
      {videoViewWindowOpen && (
        <WindowPortal
          key="main-video-view"
          id="main-video-view"
          title="Video Streams - T E R A P H O N E"
          width={800}
          height={600}
          onClose={handleCloseVideoView}
        >
          <MainVideoView setIsPopout={setIsPopout} videoItems={videoItems} />
        </WindowPortal>
      )}
      {popoutWindowNodes}
    </>
  );
}

export default VideoViews;
