/* eslint-disable no-console */
/* eslint-disable react/require-default-props */

import { RemoteTrackPublication, LocalTrackPublication } from 'livekit-client';
import * as React from 'react';

export interface VideoItemProps {
  videoTrack: RemoteTrackPublication | LocalTrackPublication;
  isLocal: boolean;
}

const VideoItem = ({ videoTrack, isLocal }: VideoItemProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isFrontFacing =
    videoTrack.track?.mediaStreamTrack.getSettings().facingMode !==
      'environment' && videoTrack.track?.source === 'camera';
  const style: React.CSSProperties = {
    // height: 'auto',
    objectFit: 'contain',
    transform: isLocal && isFrontFacing ? 'rotateY(180deg)' : '',
    // maxWidth: '100%',
    // maxHeight: 'inherit',
    maxWidth: '100%',
    maxHeight: '100%',
    height: 'auto',
    width: 'auto',
    // borderRadius: '4px',
    overflow: 'hidden',
  };

  React.useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.muted = true;
      videoTrack.track?.attach(videoEl);
      // const capabilities = videoTrack.track?.mediaStreamTrack.getCapabilities();
      // const constraints = videoTrack.track?.mediaStreamTrack.getConstraints();
      // const settings = videoTrack.track?.mediaStreamTrack.getSettings();
      // console.log('videoTrack', videoTrack);
      // console.log('capabilities', capabilities);
      // console.log('constraints', constraints);
      // console.log('settings', settings);

      return () => {
        videoTrack.track?.detach(videoEl);
      };
    }
    return () => {};
  }, [videoTrack, videoTrack.track]);

  const handleLoadedMetadata = React.useCallback(
    (/* event: Event */) => {
      // console.log('VideoRenderer.handleLoadedMetadata', event);
      // const target = event.target as HTMLVideoElement;
      // console.log(
      //   'Video loaded metadata h w:',
      //   target.videoHeight,
      //   target.videoWidth
      // );
    },
    []
  );

  React.useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
    return () => {};
  }, [handleLoadedMetadata]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video ref={videoRef} style={style} />
  );
};

export default VideoItem;
