import * as React from 'react';
import RoomContext from '../contexts/RoomContext';

const useRoom = () => {
  return React.useContext(RoomContext);
};

export default useRoom;
