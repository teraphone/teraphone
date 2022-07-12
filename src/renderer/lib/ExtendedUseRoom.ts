/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import * as React from 'react';
import {
  AudioTrack,
  Participant,
  RemoteTrack,
  Room,
  RoomEvent,
  Track,
  RoomOptions,
  RoomConnectOptions,
  ConnectionState,
  LocalTrackPublication,
  RemoteTrackPublication,
  LocalParticipant,
  RemoteParticipant,
} from 'livekit-client';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setWindowOpen } from '../redux/VideoViewSlice';
import { selectGroup } from '../redux/WorldSlice';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import {
  selectScreens,
  selectWindows,
  setScreens,
  setWindows,
} from '../redux/ScreenShareSlice';

export type VideoItemValue = {
  userName: string;
  isPopout: boolean;
  isLocal: boolean;
  videoTrack: LocalTrackPublication | RemoteTrackPublication;
};

export type VideoItemsObject = {
  [sid: string]: VideoItemValue;
};

export interface RoomState {
  connect: (
    url: string,
    token: string,
    options?: RoomConnectOptions
  ) => Promise<Room | undefined>;
  isConnecting: boolean;
  room?: Room;
  /* all participants in the room, including the local participant. */
  participants: Participant[];
  /* all subscribed audio tracks in the room, not including local participant. */
  audioTracks: AudioTrack[];
  error?: Error;
  connectionState: ConnectionState;
}

export interface ExtendedRoomState {
  roomState: RoomState;
  videoItemsState: {
    videoItems: VideoItemsObject;
    setVideoItems: React.Dispatch<React.SetStateAction<VideoItemsObject>>;
    setUpScreenTrack: (
      videoTrack: RemoteTrackPublication | LocalTrackPublication,
      participant: RemoteParticipant | LocalParticipant
    ) => void;
    takeDownScreenTrack: (
      videoTrack: RemoteTrackPublication | LocalTrackPublication,
      _participant: RemoteParticipant | LocalParticipant
    ) => void;
    unShareScreen: (sourceId: string) => void;
  };
}

export function useRoomExtended(roomOptions?: RoomOptions): ExtendedRoomState {
  const [room] = React.useState<Room>(new Room(roomOptions));
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState<Error>();
  const [participants, setParticipants] = React.useState<Participant[]>([]);
  const [audioTracks, setAudioTracks] = React.useState<AudioTrack[]>([]);
  const [connectionState, setConnectionState] = React.useState<ConnectionState>(
    ConnectionState.Disconnected
  );
  const dispatch = useAppDispatch();
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { groupId } = currentRoom;
  const groupInfo = useAppSelector((state) => selectGroup(state, groupId));
  const [videoItems, setVideoItems] = React.useState<VideoItemsObject>({});
  const localParticipant = room?.localParticipant;

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

  const connectFn = React.useCallback(
    async (url: string, token: string, options?: RoomConnectOptions) => {
      setIsConnecting(true);
      try {
        const onParticipantsChanged = () => {
          if (!room) return;
          const remotes = Array.from(room.participants.values());
          setParticipants([room.localParticipant, ...remotes]);
        };
        const onSubscribedTrackChanged = (track?: RemoteTrack) => {
          // ordering may have changed, re-sort
          onParticipantsChanged();
          if ((track && track.kind !== Track.Kind.Audio) || !room) {
            return;
          }
          const tracks: AudioTrack[] = [];
          room.participants.forEach((p) => {
            p.audioTracks.forEach((pub) => {
              if (pub.audioTrack) {
                tracks.push(pub.audioTrack);
              }
            });
          });
          setAudioTracks(tracks);
        };

        const onConnectionStateChanged = (state: ConnectionState) => {
          setConnectionState(state);
        };

        room.once(RoomEvent.Disconnected, () => {
          console.log(RoomEvent.Disconnected);
          dispatch(setScreens({}));
          dispatch(setWindows({}));
          dispatch(setWindowOpen(false));
          room
            .off(RoomEvent.ParticipantConnected, onParticipantsChanged)
            .off(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
            .off(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged)
            .off(RoomEvent.TrackSubscribed, onSubscribedTrackChanged)
            .off(RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged)
            .off(RoomEvent.LocalTrackPublished, onParticipantsChanged)
            .off(RoomEvent.LocalTrackUnpublished, onParticipantsChanged)
            .off(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged)
            .off(RoomEvent.ConnectionStateChanged, onConnectionStateChanged)
            // extensions
            .off(RoomEvent.TrackPublished, handleTrackPublished)
            .off(RoomEvent.TrackUnpublished, handleTrackUnpublished)
            .off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
            .off(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);
        });
        room
          .on(RoomEvent.ParticipantConnected, onParticipantsChanged)
          .on(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
          .on(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged)
          .on(RoomEvent.TrackSubscribed, onSubscribedTrackChanged)
          .on(RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged)
          .on(RoomEvent.LocalTrackPublished, onParticipantsChanged)
          .on(RoomEvent.LocalTrackUnpublished, onParticipantsChanged)
          // trigger a state change by re-sorting participants
          .on(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged)
          .on(RoomEvent.ConnectionStateChanged, onConnectionStateChanged)
          // extensions
          .on(RoomEvent.TrackPublished, handleTrackPublished)
          .on(RoomEvent.TrackUnpublished, handleTrackUnpublished)
          .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
          .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);

        await room?.connect(url, token, options);
        setIsConnecting(false);
        onSubscribedTrackChanged();
        setError(undefined);
        return room;
      } catch (e) {
        setIsConnecting(false);
        if (e instanceof Error) {
          setError(error);
        } else {
          setError(new Error('an error has occured'));
        }

        return undefined;
      }
    },
    [
      dispatch,
      error,
      handleLocalTrackUnpublished,
      handleTrackPublished,
      handleTrackUnpublished,
      handleTrackUnsubscribed,
      room,
    ]
  );

  return {
    roomState: {
      connect: connectFn,
      isConnecting,
      room,
      error,
      participants,
      audioTracks,
      connectionState,
    },
    videoItemsState: {
      videoItems,
      setVideoItems,
      setUpScreenTrack,
      takeDownScreenTrack,
      unShareScreen,
    },
  };
}
