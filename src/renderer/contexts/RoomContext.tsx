/* eslint-disable no-console */

import * as React from 'react';
import { RoomOptions } from 'livekit-client';
import { useRoom, RoomState } from '@livekit/react-core';

const RoomContext = React.createContext({} as RoomState);

export const RoomProvider: React.FC = ({ children }) => {
  const roomOptions: RoomOptions = {
    adaptiveStream: { pixelDensity: 'screen' },
    dynacast: false,
  };
  const roomState = useRoom(roomOptions);
  React.useEffect(() => {
    console.log('RoomProvider Mounted', roomState);
    return () => console.log('RoomProvider Unmounted');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <RoomContext.Provider value={roomState}>{children}</RoomContext.Provider>
  );
};

export default RoomContext;
