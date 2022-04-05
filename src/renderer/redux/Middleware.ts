import { createListenerMiddleware } from '@reduxjs/toolkit';
import { onValue, ref } from 'firebase/database';
import { addParticipantRTListener, setGroup } from './ArtySlice';
import * as models from '../models/models';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: addParticipantRTListener,
  effect: (action, listenerApi) => {
    const { db, groupId } = action.payload;
    const nodeRef = ref(db, `participants/${groupId}`);
    onValue(nodeRef, (snapshot) => {
      const rooms = snapshot.val() as models.ParticipantRTRooms;
      listenerApi.dispatch(setGroup({ groupId, rooms }));
    });
  },
});

export default listenerMiddleware;
