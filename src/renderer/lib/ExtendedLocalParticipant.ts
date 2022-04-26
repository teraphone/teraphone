import {
  LocalParticipant,
  LocalTrack,
  ScreenShareCaptureOptions,
} from 'livekit-client';

declare module 'livekit-client' {
  interface LocalParticipant {
    setScreenShareTrackEnabled(
      userId: string,
      sourceId: string,
      enabled: boolean
    ): Promise<void>;
    createScreenShareTracks(
      userId: string,
      sourceId: string,
      options?: ScreenShareCaptureOptions
    ): Promise<Array<LocalTrack>>;
  }
}

async function setScreenShareTrackEnabled(
  this: LocalParticipant,
  userId: string,
  sourceId: string,
  enabled: boolean
) {
  console.log('called setScreenShareTrackEnabled', this);
  return new Promise<void>(() => {
    // do nothing
  });
}

async function createScreenShareTracks(
  this: LocalParticipant,
  userId: string,
  sourceId: string,
  options?: ScreenShareCaptureOptions
) {
  console.log('called createScreenShareTracks', this);
  return new Promise<Array<LocalTrack>>(() => {
    // do nothing
  });
}

LocalParticipant.prototype.setScreenShareTrackEnabled =
  setScreenShareTrackEnabled; // Todo: implement this
LocalParticipant.prototype.createScreenShareTracks = createScreenShareTracks; // Todo: implement this
