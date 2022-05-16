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

export type VideoItemValue = {
  userName: string;
  isPopout: boolean;
  isLocal: boolean;
  videoTrack: LocalTrackPublication | RemoteTrackPublication;
};

export type VideoItemsObject = {
  [sid: string]: VideoItemValue;
};

function VideoViews() {
  return null;
}

export default VideoViews;
