/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import * as React from 'react';
import {
  LocalParticipant,
  LocalTrackPublication,
  RemoteTrackPublication,
  RemoteParticipant,
} from 'livekit-client';
import useRoom from '../hooks/useRoom';
import WindowPortal from './WindowPortal';
import MainVideoView, { VideoItemsObject } from './MainVideoView';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWindowOpen, setWindowOpen } from '../redux/VideoViewSlice';
import { selectGroup } from '../redux/WorldSlice';
import { selectAppUser } from '../redux/AppUserSlice';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import { selectScreens, selectWindows } from '../redux/ScreenShareSlice';
import { startStream } from '../lib/ExtendedLocalParticipant';

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

  const handleCloseVideoView = React.useCallback(() => {
    dispatch(setWindowOpen(false));
  }, [dispatch]);

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
      _participant: RemoteParticipant | LocalParticipant
    ) => {
      const sid = videoTrack.trackSid;
      delete videoItems[sid];
      setVideoItems(videoItems);
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
  }, [groupInfo?.users, participants, setUpScreenTrack]);

  React.useEffect(() => {
    // add local video tracks to videoItems
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

  const popoutWindowNodes = Object.entries(videoItems)
    .filter(([sid, videoItem]) => {
      return videoItem.isPopout;
    })
    .map(([sid, videoItem]) => {
      const { userName, isLocal, videoTrack } = videoItem;
      const title = `${userName}'s Screen - T E R A P H O N E`;
      console.log('popout', sid, videoItem);
      return <></>;
    });

  return (
    <>
      {videoViewWindowOpen && (
        <WindowPortal
          title="Video - T E R A P H O N E"
          width={800}
          height={600}
          onClose={handleCloseVideoView}
        >
          <>
            {/* <VideoView /> */}
            <MainVideoView
              setUpScreenTrack={setUpScreenTrack}
              takeDownScreenTrack={takeDownScreenTrack}
              videoItems={videoItems}
            />
          </>
        </WindowPortal>
      )}
    </>
  );
}

export default VideoViews;
