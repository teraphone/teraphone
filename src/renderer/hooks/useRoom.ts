import * as React from 'react';
import RoomContext from '../contexts/RoomContext';

const useRoom = () => {
  const { roomState } = React.useContext(RoomContext);
  return roomState;
};

export default useRoom;
