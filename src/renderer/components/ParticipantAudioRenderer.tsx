/* eslint-disable no-console */
import * as React from 'react';
import { AudioTrack } from 'livekit-client';
import AudioRenderer from './AudioRenderer';
import { useAppSelector } from '../redux/hooks';
import { selectDeafen } from '../redux/MuteSlice';

function ParticipantAudioRenderer(props: { audioTracks: AudioTrack[] }) {
  const { audioTracks } = props;
  const deafen = useAppSelector(selectDeafen);
  const volume = deafen ? 0 : 1;

  React.useEffect(() => {
    console.log('ParticipantAudioRenderer Mounted');

    return () => {
      console.log('ParticipantAudioRenderer Unmounted');
    };
  }, []);

  const renderers = audioTracks.map((audioTrack) => {
    if (!audioTrack) {
      return null;
    }

    return (
      <AudioRenderer key={audioTrack.sid} track={audioTrack} volume={volume} />
    );
  });

  return <>{renderers}</>;
}

export default ParticipantAudioRenderer;
