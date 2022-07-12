import * as React from 'react';
import RoomContext from '../contexts/RoomContext';

const useVideoItems = () => {
  const { videoItemsState } = React.useContext(RoomContext);
  return videoItemsState;
};

export default useVideoItems;
