/* eslint-disable no-console */
/* eslint-disable consistent-return */
import { Track } from 'livekit-client';
import * as React from 'react';
import { selectSelectedSpeakerId } from '../redux/SettingsSlice';
import { useAppSelector } from '../redux/hooks';

export interface AudioTrackProps {
  track: Track;
  isLocal: boolean;
  volume: number; // Is a double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
}

type HTMLAudioElement2 = HTMLAudioElement & {
  setSinkId(deviceId: string): void;
};

function AudioRenderer({ track, isLocal, volume }: AudioTrackProps) {
  const audioEl = React.useRef<HTMLAudioElement2>();
  const selectedSpeakerId = useAppSelector(selectSelectedSpeakerId);

  React.useEffect(() => {
    console.log('AudioRenderer Mounted');
    return () => console.log('AudioRenderer Unmounted');
  }, []);

  React.useEffect(() => {
    console.log('AudioRenderer -> useEffect');
    if (isLocal) {
      // don't play own audio
      return;
    }
    audioEl.current = track.attach() as HTMLAudioElement2;
    if (track.sid) {
      audioEl.current.setAttribute('data-audio-track-id', track.sid);
    }
    audioEl.current.volume = volume;
    if (selectedSpeakerId !== '') {
      if ('setSinkId' in audioEl.current) {
        audioEl.current.setSinkId(selectedSpeakerId);
      }
    }

    return () => track.detach().forEach((el) => el.remove());
  }, [track, isLocal, volume, selectedSpeakerId]);

  return null;
}

export default React.memo(AudioRenderer);
