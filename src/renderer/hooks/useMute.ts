import * as React from 'react';
import MuteContext from '../contexts/MuteContext';

const useMute = () => {
  return React.useContext(MuteContext);
};

export default useMute;
