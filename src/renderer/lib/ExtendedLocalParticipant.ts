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
    screensPendingPublishing: Set<string>;
  }
}

export async function createScreenShareTracks(
  sourceId: string,
  options?: ScreenShareCaptureOptions
): Promise<Array<LocalTrack>> {
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
        // maxWidth: VideoPresets.h2160.width,
        // minHeight: VideoPresets.h1080.height,
        // maxHeight: VideoPresets.h2160.height,
        // minFrameRate: 5,
        // maxFrameRate: 30,
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

export async function setScreenShareTrackEnabled(
  localParticipant: LocalParticipant,
  userId: string,
  sourceId: string,
  enabled: boolean,
  options?: ScreenShareCaptureOptions
): Promise<void> {
  const screenShareOptions = options || { audio: false };

  const trackName = `${userId}/${sourceId}`;
  const track = localParticipant.getTrackByName(trackName);
  if (enabled) {
    if (track) {
      await track.unmute();
    } else {
      let localTrack: LocalTrack | undefined;
      if (!localParticipant.screensPendingPublishing) {
        localParticipant.screensPendingPublishing = new Set<string>();
      }
      if (localParticipant.screensPendingPublishing.has(trackName)) {
        console.log('skipping duplicate published source', trackName);
        return;
      }
      localParticipant.screensPendingPublishing.add(trackName);
      try {
        [localTrack] = await createScreenShareTracks(
          sourceId,
          screenShareOptions
        );
        await localParticipant.publishTrack(localTrack, { name: trackName });
      } catch (e) {
        if (e instanceof Error && !(e instanceof TrackInvalidError)) {
          localParticipant.emit(ParticipantEvent.MediaDevicesError, e);
        }
        throw e;
      } finally {
        localParticipant.screensPendingPublishing.delete(trackName);
      }
    }
  } else if (track && track.track) {
    localParticipant.unpublishTrack(track.track);
  }
}
