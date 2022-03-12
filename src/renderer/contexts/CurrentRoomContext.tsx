import * as React from 'react';

type CurrentRoom = {
  roomId: number;
  roomName: string;
  groupId: number;
  groupName: string;
};

export interface CurrentRoomCtx {
  currentRoom: CurrentRoom;
  setCurrentRoom: (r: CurrentRoom) => void;
}

const defaultContext: CurrentRoomCtx = {
  currentRoom: {
    roomId: 0,
    roomName: '',
    groupId: 0,
    groupName: '',
  } as CurrentRoom,
  setCurrentRoom: () => {},
};

const CurrentRoomContext = React.createContext(defaultContext);

export const CurrentRoomProvider: React.FC = ({ children }) => {
  const [currentRoom, setCurrentRoom] = React.useState(
    defaultContext.currentRoom
  );

  return (
    <CurrentRoomContext.Provider value={{ currentRoom, setCurrentRoom }}>
      {children}
    </CurrentRoomContext.Provider>
  );
};

export default CurrentRoomContext;
