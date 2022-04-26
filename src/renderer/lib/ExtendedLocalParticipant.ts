/* eslint-disable no-console */
import {
  LocalParticipant,
  LocalTrack,
  ScreenShareCaptureOptions,
  TrackInvalidError,
  ParticipantEvent,
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
    screensPendingPublishing: Set<string>;
  }
}

async function setScreenShareTrackEnabled(
  this: LocalParticipant,
  userId: string,
  sourceId: string,
  enabled: boolean
) {
  console.log('called setScreenShareTrackEnabled', this);
  const trackName = `${userId}/${sourceId}`;
  const track = this.getTrackByName(trackName);
  if (enabled) {
    if (track) {
      await track.unmute();
    } else {
      let localTrack: LocalTrack | undefined;
      if (!this.screensPendingPublishing) {
        this.screensPendingPublishing = new Set<string>();
      }
      if (this.screensPendingPublishing.has(trackName)) {
        console.log('skipping duplicate published source', trackName);
        return;
      }
      this.screensPendingPublishing.add(trackName);
      try {
        [localTrack] = await this.createScreenShareTracks(userId, sourceId, {
          audio: false,
        });
        await this.publishTrack(localTrack);
      } catch (e) {
        if (e instanceof Error && !(e instanceof TrackInvalidError)) {
          this.emit(ParticipantEvent.MediaDevicesError, e);
        }
        throw e;
      } finally {
        this.screensPendingPublishing.delete(trackName);
      }
    }
  } else if (track && track.track) {
    this.unpublishTrack(track.track);
  }
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
