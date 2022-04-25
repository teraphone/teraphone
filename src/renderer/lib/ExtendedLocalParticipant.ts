import {
  LocalParticipant,
  LocalTrack,
  ScreenShareCaptureOptions,
} from 'livekit-client';

declare module 'livekit-client' {
  interface LocalParticipant {
    setScreenShareTrackEnabled(id: string, enabled: boolean): Promise<void>;
    createScreenShareTracks(
      id: string,
      options?: ScreenShareCaptureOptions
    ): Promise<Array<LocalTrack>>;
  }
}

async function setScreenShareTrackEnabled(
  this: LocalParticipant,
  id: string,
  enabled: boolean
) {
  console.log('called setScreenShareTrackEnabled', this);
  return new Promise<void>(() => {
    // do nothing
  });
}

async function createScreenShareTracks(
  this: LocalParticipant,
  id: string,
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
