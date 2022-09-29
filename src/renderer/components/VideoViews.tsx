/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import * as React from 'react';
import { ConnectionState, Track } from 'livekit-client';
import { Box } from '@mui/material';
import { selectCameraIsSharing } from '../redux/CameraShareSlice';
import useRoom from '../hooks/useRoom';
import useVideoItems from '../hooks/useVideoItems';
import MainVideoView from './MainVideoView';
import { useAppSelector } from '../redux/hooks';
import { selectAppUser } from '../redux/AppUserSlice';
import { selectScreens, selectWindows } from '../redux/ScreenShareSlice';
import { startStream } from '../lib/ExtendedLocalParticipant';
import PopoutVideoView from './PopoutVideoView';

function VideoViews() {
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);
  const isCameraShare = useAppSelector(selectCameraIsSharing);
  const { tenantUser } = useAppSelector(selectAppUser);
  const { room } = useRoom();
  const { videoItems, setVideoItems, setUpVideoTrack, takeDownVideoTrack } =
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
            setUpVideoTrack(videoTrack, participant);
          });
        }
      });
    }
  }, [participants, setUpVideoTrack]);

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
                setUpVideoTrack(videoTrack, localParticipant);
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
    setUpVideoTrack,
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
          if (videoTrack.source === Track.Source.ScreenShare) {
            const sourceId = trackName.split('/')[1];
            if (!screens[sourceId] && !windows[sourceId] && track) {
              takeDownVideoTrack(videoTrack, localParticipant);
              localParticipant.unpublishTrack(track, true);
            }
          } else if (!isCameraShare && track) {
            takeDownVideoTrack(videoTrack, localParticipant);
            localParticipant.unpublishTrack(track, true);
          }
        });
      }
    }
  }, [isCameraShare, localParticipant, screens, takeDownVideoTrack, windows]);

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
    <Box sx={{ backgroundColor: 'black', flexGrow: 1 }}>
      <MainVideoView setIsPopout={setIsPopout} videoItems={videoItems} />
      {popoutWindowNodes}
    </Box>
  );
}

export default VideoViews;
