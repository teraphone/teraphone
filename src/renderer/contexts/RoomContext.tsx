import * as React from 'react';
import { useRoom, RoomState } from 'livekit-react';

const RoomContext = React.createContext({} as RoomState);

export const RoomProvider: React.FC = ({ children }) => {
  const roomState = useRoom();
  console.log('Rendering RoomProvider:', roomState);
  return (
    <RoomContext.Provider value={roomState}>{children}</RoomContext.Provider>
  );
};

export default RoomContext;
