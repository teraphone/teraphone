/* eslint-disable no-console */
import * as React from 'react';
import useRoom from '../hooks/useRoom';
import { useAppSelector } from '../redux/hooks';
import { selectMute, selectDeafen } from '../redux/MuteSlice';
import AudioRenderer from './AudioRenderer';

function AudioRenderers() {
  React.useEffect(() => {
    console.log('AudioRenderers Mounted');
    return () => console.log('AudioRenderers Unmounted');
  }, []);

  const { room } = useRoom();
  const mute = useAppSelector(selectMute);
  const deafen = useAppSelector(selectDeafen);

  if (!room) {
    return null;
  }

  const { localParticipant, participants: remoteParticipants } = room;
  if (localParticipant) {
    localParticipant.audioTracks.forEach((localTrackPub) => {
      const localAudioTrack = localTrackPub.track;
      if (!localAudioTrack) {
        return;
      }
      if (mute) {
        localAudioTrack?.mute();
      } else {
        localAudioTrack?.unmute();
      }
    });
  }

  const renderers: React.ReactNode[] = [];
  remoteParticipants.forEach((remoteParticipant) => {
    remoteParticipant.audioTracks.forEach((remoteTrackPub) => {
      remoteTrackPub.setSubscribed(true);
      const remoteAudioTrack = remoteTrackPub?.track;
      if (remoteAudioTrack) {
        const volume = deafen ? 0 : 1;
        renderers.push(
          <AudioRenderer
            key={remoteTrackPub.trackSid}
            track={remoteAudioTrack}
            isLocal={false}
            volume={volume}
          />
        );
      }
    });
  });

  return <div>{renderers}</div>;
}

export default AudioRenderers;
