/* eslint-disable no-console */
import { RemoteTrackPublication } from 'livekit-client';
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

  const { room, participants, audioTracks } = useRoom();
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

  React.useEffect(() => {
    participants.slice(1).forEach((remoteParticipant) => {
      Object.values(remoteParticipant.audioTracks).forEach(
        (remoteTrackPub: RemoteTrackPublication) => {
          remoteTrackPub.setSubscribed(true);
        }
      );
    });
  }, [participants]);

  if (!room) {
    return null;
  }

  const renderers: React.ReactNode[] = [];
  participants.slice(1).forEach((participant) => {
    const participantTrackIds = Object.keys(participant.audioTracks);

    renderers.push(
      <ParticipantAudioRenderer
        key={participant.sid}
        audioTracks={audioTracks.filter((audioTrack) =>
          participantTrackIds.includes(audioTrack.sid as string)
        )}
      />
    );
  });

  return <div>{renderers}</div>;
}

export default AudioRenderers;
