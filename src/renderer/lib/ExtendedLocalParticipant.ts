/* eslint-disable no-console */
import {
  LocalParticipant,
  LocalTrack,
  ScreenShareCaptureOptions,
  TrackInvalidError,
  ParticipantEvent,
  VideoPresets,
  LocalVideoTrack,
  LocalAudioTrack,
  Track,
} from 'livekit-client';

declare module 'livekit-client' {
  interface LocalParticipant {
    setScreenShareTrackEnabled(
      userId: string,
      sourceId: string,
      enabled: boolean,
      options?: ScreenShareCaptureOptions
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
  enabled: boolean,
  options?: ScreenShareCaptureOptions
) {
  const screenShareOptions = options || { audio: false };

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
        [localTrack] = await this.createScreenShareTracks(
          userId,
          sourceId,
          screenShareOptions
        );
        await this.publishTrack(localTrack, { name: trackName });
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
  // const screenShareOptions = options || { audio: false };

  // if (screenShareOptions.resolution === undefined) {
  //   screenShareOptions.resolution = VideoPresets.h1080.resolution;
  // }

  const constraints = {
    audio: options?.audio || false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sourceId,
        minWidth: VideoPresets.h1080.width,
        maxWidth: VideoPresets.h2160.width,
        minHeight: VideoPresets.h1080.height,
        maxHeight: VideoPresets.h2160.height,
        minFrameRate: 5,
        maxFrameRate: 30,
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream: MediaStream = await (<any>navigator.mediaDevices).getUserMedia(
    constraints
  );

  const tracks = stream.getVideoTracks();
  if (tracks.length === 0) {
    throw new TrackInvalidError('no video track found');
  }
  const screenVideo = new LocalVideoTrack(tracks[0]);
  screenVideo.source = Track.Source.ScreenShare;
  const localTracks: Array<LocalTrack> = [screenVideo];
  if (stream.getAudioTracks().length > 0) {
    const screenAudio = new LocalAudioTrack(stream.getAudioTracks()[0]);
    screenAudio.source = Track.Source.ScreenShareAudio;
    localTracks.push(screenAudio);
  }
  return localTracks;
}

LocalParticipant.prototype.setScreenShareTrackEnabled =
  setScreenShareTrackEnabled; // Todo: implement this
LocalParticipant.prototype.createScreenShareTracks = createScreenShareTracks; // Todo: implement this
