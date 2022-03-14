import * as React from 'react';

export enum ConnectionState {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Reconnecting = 'reconnecting',
  Error = 'error',
}

export interface ConnectionCtx {
  connectionState: ConnectionState;
  setConnectionState: (state: ConnectionState) => void;
}

const defaultContext: ConnectionCtx = {
  connectionState: ConnectionState.Disconnected,
  setConnectionState: () => {},
};

const ConnectionContext = React.createContext(defaultContext);

export const ConnectionProvider: React.FC = ({ children }) => {
  const [connectionState, setConnectionState] = React.useState<ConnectionState>(
    defaultContext.connectionState
  );

  return (
    <ConnectionContext.Provider
      value={{ connectionState, setConnectionState } as ConnectionCtx}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionContext;
