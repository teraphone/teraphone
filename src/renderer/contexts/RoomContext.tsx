/* eslint-disable no-console */
import * as React from 'react';
// import { RoomOptions } from 'livekit-client';
import { setLogLevel, LogLevel } from 'livekit-client';
import { useRoomExtended, ExtendedRoomState } from '../lib/ExtendedUseRoom';

const RoomContext = React.createContext({} as ExtendedRoomState);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const options: RoomOptions = {
  //   adaptiveStream: {
  //     pixelDensity: 1,
  //     pauseVideoInBackground: true,
  //   },
  //   dynacast: true,
  // };
  setLogLevel(LogLevel.warn);
  const extendedRoomState = useRoomExtended();

  return (
    <RoomContext.Provider value={extendedRoomState}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
