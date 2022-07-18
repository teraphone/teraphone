/* eslint-disable no-console */

import * as React from 'react';
import { useRoomExtended, ExtendedRoomState } from '../lib/ExtendedUseRoom';

const RoomContext = React.createContext({} as ExtendedRoomState);

export const RoomProvider: React.FC = ({ children }) => {
  const extendedRoomState = useRoomExtended();
  return (
    <RoomContext.Provider value={extendedRoomState}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
