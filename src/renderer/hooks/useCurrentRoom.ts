import * as React from 'react';
import CurrentRoomContext, {
  CurrentRoomCtx,
} from '../contexts/CurrentRoomContext';

const useCurrentRoom = (): CurrentRoomCtx => {
  return React.useContext(CurrentRoomContext);
};

export default useCurrentRoom;
