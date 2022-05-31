/* eslint-disable no-console */
import * as React from 'react';
import useRoom from '../hooks/useRoom';
import { useAppSelector } from '../redux/hooks';
import { selectMute } from '../redux/MuteSlice';
import ParticipantAudioRenderer from './ParticipantAudioRenderer';

function AudioRenderers() {
  React.useEffect(() => {
    console.log('AudioRenderers Mounted');
    return () => console.log('AudioRenderers Unmounted');
  }, []);

  const { room, participants } = useRoom();
  const mute = useAppSelector(selectMute);
  const localParticipant = room?.localParticipant;

  React.useEffect(() => {
    if (localParticipant) {
      localParticipant.audioTracks.forEach((localTrackPub) => {
        const localAudioTrack = localTrackPub.track;
        if (!localAudioTrack) {
          return;
        }
        if (mute) {
          localAudioTrack.mute().catch(console.error);
        } else {
          localAudioTrack.unmute().catch(console.error);
        }
      });
    }
  }, [localParticipant, mute]);

  if (!room) {
    return null;
  }

  const renderers: React.ReactNode[] = [];
  participants.slice(1).forEach((participant) => {
    renderers.push(
      <ParticipantAudioRenderer
        key={participant.sid}
        participant={participant}
      />
    );
  });

  return <div>{renderers}</div>;
}

export default AudioRenderers;
