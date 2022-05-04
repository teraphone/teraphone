/* eslint-disable no-console */
/* eslint-disable react/require-default-props */
import { Property } from 'csstype';
import { Track } from 'livekit-client';
import * as React from 'react';

export interface VideoRendererProps {
  track: Track;
  isLocal: boolean;
}

export const VideoRenderer = ({ track, isLocal }: VideoRendererProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isFrontFacing =
    track.mediaStreamTrack.getSettings().facingMode !== 'environment' &&
    track.source === 'camera';
  const style: React.CSSProperties = {
    transform:
      isLocal && isFrontFacing
        ? 'rotateY(180deg) translate(-50%, -50%)'
        : 'translate(-50%, -50%)',
    position: 'relative',
    top: '50%',
    left: '50%',
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: '100%',
    objectFit: 'scale-down',
  };

  React.useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.muted = true;
      track.attach(videoEl);
      return () => {
        track.detach(videoEl);
      };
    }
    return () => {};
  }, [track]);

  const handleLoadedMetadata = React.useCallback((event: Event) => {
    console.log('VideoRenderer.handleLoadedMetadata', event);
    const target = event.target as HTMLVideoElement;
    console.log(
      'Video loaded metadata h w:',
      target.videoHeight,
      target.videoWidth
    );
  }, []);

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

export default VideoRenderer;
