import * as React from 'react';
import ConnectionContext from '../contexts/ConnectionContext';

const useConnection = () => {
  return React.useContext(ConnectionContext);
};

export default useConnection;
