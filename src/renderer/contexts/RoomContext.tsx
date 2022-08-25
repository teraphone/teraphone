/* eslint-disable no-console */
// import { RoomOptions } from 'livekit-client';
import * as React from 'react';
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
  const extendedRoomState = useRoomExtended();

  return (
    <RoomContext.Provider value={extendedRoomState}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
