/* eslint-disable consistent-return */
import { Track } from 'livekit-client';
import * as React from 'react';

export interface AudioTrackProps {
  track: Track;
  isLocal: boolean;
  volume: number; // Is a double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
}

function AudioRenderer({ track, isLocal, volume }: AudioTrackProps) {
  const audioEl = React.useRef<HTMLAudioElement>();

  React.useEffect(() => {
    console.log('AudioRenderer -> useEffect');
    if (isLocal) {
      // don't play own audio
      return;
    }
    audioEl.current = track.attach();
    if (track.sid) {
      audioEl.current.setAttribute('data-audio-track-id', track.sid);
    }
    audioEl.current.volume = volume;

    return () => track.detach().forEach((el) => el.remove());
  }, [track, isLocal, volume]);

  return null;
}

export default AudioRenderer;
