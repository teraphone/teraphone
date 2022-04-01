import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export enum ConnectionStatus {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Reconnecting = 'reconnecting',
  Error = 'error',
}

type ConnectionStatusState = {
  connectionStatus: ConnectionStatus;
};

const initialState: ConnectionStatusState = {
  connectionStatus: ConnectionStatus.Disconnected,
};

export const connectionStatusSlice = createSlice({
  name: 'connectionStatus',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connectionStatus = action.payload;
    },
  },
});

export const { setConnectionStatus } = connectionStatusSlice.actions;

export const selectConnectionStatus = (state: RootState) =>
  state.connectionStatus;

export default connectionStatusSlice.reducer;
