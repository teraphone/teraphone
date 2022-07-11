/* eslint-disable no-console */

import * as React from 'react';
import { useRoom, RoomState } from '../lib/ExtendedUseRoom';

const RoomContext = React.createContext({} as RoomState);

export const RoomProvider: React.FC = ({ children }) => {
  const roomState = useRoom();
  return (
    <RoomContext.Provider value={roomState}>{children}</RoomContext.Provider>
  );
};

export default RoomContext;
