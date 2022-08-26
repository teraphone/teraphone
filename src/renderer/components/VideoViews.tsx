/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import * as React from 'react';
import { ConnectionState } from 'livekit-client';
import useRoom from '../hooks/useRoom';
import useVideoItems from '../hooks/useVideoItems';
import WindowPortal from './WindowPortal';
import MainVideoView from './MainVideoView';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWindowOpen, setWindowOpen } from '../redux/VideoViewSlice';
import { selectAppUser } from '../redux/AppUserSlice';
import { selectScreens, selectWindows } from '../redux/ScreenShareSlice';
import { startStream } from '../lib/ExtendedLocalParticipant';
import PopoutVideoView from './PopoutVideoView';

function VideoViews() {
  const dispatch = useAppDispatch();
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);
  const videoViewWindowOpen = useAppSelector(selectWindowOpen);
  const { tenantUser } = useAppSelector(selectAppUser);
  const { room } = useRoom();
  const { videoItems, setVideoItems, setUpScreenTrack, takeDownScreenTrack } =
    useVideoItems();
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

  const setIsPopout = React.useCallback(
    (sid: string, isPopout: boolean) => {
      setVideoItems((prev) => ({
        ...prev,
        [sid]: { ...prev[sid], isPopout },
      }));
    },
    [setVideoItems]
  );

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
    if (room?.state === ConnectionState.Connected) {
      if (Object.keys(screens).length > 0) {
        Object.entries(screens).forEach(([sourceId, _]) => {
          if (!sourceIsPublished(sourceId)) {
            p.push(
              startStream(room.localParticipant, tenantUser.oid, sourceId)
            );
          }
        });
      }

      if (Object.keys(windows).length > 0) {
        Object.entries(windows).forEach(([sourceId, _]) => {
          if (!sourceIsPublished(sourceId)) {
            p.push(
              startStream(room.localParticipant, tenantUser.oid, sourceId)
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
            localParticipant.videoTracks.forEach((videoTrack, sid) => {
              if (!videoItems[sid]) {
                setUpScreenTrack(videoTrack, localParticipant);
              }
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
    tenantUser.oid,
    localParticipant,
    room,
    screens,
    setUpScreenTrack,
    sourceIsPublished,
    windows,
    videoItems,
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
          height={530}
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
