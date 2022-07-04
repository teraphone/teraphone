/* eslint-disable no-console */

import * as React from 'react';
import { useRoom, RoomState } from 'livekit-react';

const RoomContext = React.createContext({} as RoomState);

export const RoomProvider: React.FC = ({ children }) => {
  const roomState = useRoom();
  React.useEffect(() => {
    console.log('RoomProvider Mounted', roomState);
    return () => console.log('RoomProvider Unmounted');
  }, [roomState]);
  return (
    <RoomContext.Provider value={roomState}>{children}</RoomContext.Provider>
  );
};

export default RoomContext;
