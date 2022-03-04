import * as React from 'react';
import { useRoom, RoomState } from 'livekit-react';

const RoomContext = React.createContext({} as RoomState);

export const RoomProvider: React.FC = ({ children }) => {
  const { connect, isConnecting, room, error, participants, audioTracks } =
    useRoom();
  return (
    <RoomContext.Provider
      value={{ connect, isConnecting, room, error, participants, audioTracks }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
