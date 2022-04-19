import {
  LocalParticipant,
  LocalTrack,
  ScreenShareCaptureOptions,
} from 'livekit-client';

declare module 'livekit-client' {
  interface LocalParticipant {
    extendedSetTrackEnabled(id: string, enabled: boolean): Promise<void>;
    extendedCreateScreenTracks(
      id: string,
      options?: ScreenShareCaptureOptions
    ): Promise<Array<LocalTrack>>;
  }
}

async function extendedSetTrackEnabled(
  this: LocalParticipant,
  id: string,
  enabled: boolean
) {
  console.log('called extendedSetTrackEnabled');
  return new Promise<void>(() => {
    // do nothing
  });
}

async function extendedCreateScreenTracks(
  this: LocalParticipant,
  id: string,
  options?: ScreenShareCaptureOptions
) {
  console.log('called extendedCreateScreenTracks');
  return new Promise<Array<LocalTrack>>(() => {
    // do nothing
  });
}

LocalParticipant.prototype.extendedSetTrackEnabled = extendedSetTrackEnabled; // Todo: implement this
LocalParticipant.prototype.extendedCreateScreenTracks =
  extendedCreateScreenTracks; // Todo: implement this
