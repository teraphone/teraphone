/* eslint-disable no-console */
import * as React from 'react';
import {
  Participant,
  RemoteTrackPublication,
  LocalParticipant,
  AudioTrack,
} from 'livekit-client';
import AudioRenderer from './AudioRenderer';
import { useAppSelector } from '../redux/hooks';
import { selectDeafen } from '../redux/MuteSlice';

function ParticipantAudioRenderer(props: {
  participant: Participant;
  audioTracks: AudioTrack[]; // this forces a rerender that fixed #150
}) {
  const [isMounted, setIsMounted] = React.useState(false);
  const { participant, audioTracks } = props;
  const isLocal = participant instanceof LocalParticipant;
  const microphonePublications = participant
    .getTracks()
    .filter((track) => track.kind === 'audio');
  const deafen = useAppSelector(selectDeafen);
  const volume = deafen ? 0 : 1;

  React.useEffect(() => {
    console.log('ParticipantAudioRenderer Mounted');
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      console.log('ParticipantAudioRenderer Unmounted');
    };
  }, []);

  React.useEffect(() => {
    console.log('ParticipantAudioRenderer audioTracks', audioTracks);
  }, [audioTracks]);

  React.useEffect(() => {
    if (isMounted) {
      if (!isLocal) {
        microphonePublications.forEach((microphonePublication) => {
          (microphonePublication as RemoteTrackPublication).setSubscribed(true);
        });
      }
    }
  }, [isLocal, isMounted, microphonePublications]);

  const renderers = microphonePublications.map((microphonePublication) => {
    const { track, trackSid } = microphonePublication;

    if (!track) {
      return null;
    }

    if (isLocal) {
      return null;
    }

    return (
      <AudioRenderer
        key={trackSid}
        track={track}
        isLocal={isLocal}
        volume={volume}
      />
    );
  });

  return <>{renderers}</>;
}

export default ParticipantAudioRenderer;
