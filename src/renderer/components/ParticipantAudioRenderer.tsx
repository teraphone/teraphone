/* eslint-disable no-console */
import * as React from 'react';
import {
  Participant,
  RemoteTrackPublication,
  LocalParticipant,
  Track,
} from 'livekit-client';
import AudioRenderer from './AudioRenderer';
import { useAppSelector } from '../redux/hooks';
import { selectDeafen } from '../redux/MuteSlice';

function ParticipantAudioRenderer(props: { participant: Participant }) {
  const [isMounted, setIsMounted] = React.useState(false);
  const { participant } = props;
  const isLocal = participant instanceof LocalParticipant;
  const microphonePublication = participant.getTrack(Track.Source.Microphone);
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
    if (isMounted) {
      if (!isLocal && microphonePublication) {
        (microphonePublication as RemoteTrackPublication).setSubscribed(true);
      }
    }
  }, [isLocal, isMounted, microphonePublication]);

  if (!microphonePublication) {
    return null;
  }

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
}

export default ParticipantAudioRenderer;
