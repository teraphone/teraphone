/* eslint-disable react/require-default-props */
import { Property } from 'csstype';
import { Track } from 'livekit-client';
import * as React from 'react';

export interface VideoRendererProps {
  track: Track;
  isLocal: boolean;
  objectFit?: Property.ObjectFit;
  className?: string;
  width?: Property.Width;
  height?: Property.Height;
  onSizeChanged?: (width: number, height: number) => void;
}

export const VideoRenderer = ({
  track,
  isLocal,
  objectFit,
  className,
  onSizeChanged,
  width,
  height,
}: VideoRendererProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isFrontFacing =
    track.mediaStreamTrack.getSettings().facingMode !== 'environment' &&
    track.source === 'camera';
  const style: React.CSSProperties = {
    transform: isLocal && isFrontFacing ? 'rotateY(180deg)' : '',
    display: 'inline-block',
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    verticalAlign: 'middle',
  };
  if (objectFit) {
    style.objectFit = objectFit;
  }

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

  const handleResize = React.useCallback(
    (event: UIEvent) => {
      if (event.target instanceof HTMLVideoElement) {
        if (onSizeChanged) {
          onSizeChanged(event.target.videoWidth, event.target.videoHeight);
        }
      }
    },
    [onSizeChanged]
  );

  React.useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.addEventListener('resize', handleResize);
      return () => {
        videoEl.removeEventListener('resize', handleResize);
      };
    }
    return () => {};
  }, [handleResize]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video ref={videoRef} className={className} style={style} />
  );
};

export default VideoRenderer;
