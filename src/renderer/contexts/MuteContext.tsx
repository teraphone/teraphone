import * as React from 'react';

type MuteState = {
  mute: boolean;
  toggleMute: () => void;
  deafen: boolean;
  toggleDeafen: () => void;
};

const MuteContext = React.createContext({} as MuteState);

export const MuteProvider: React.FC = ({ children }) => {
  const [mute, setMute] = React.useState(false);
  const [deafen, setDeafen] = React.useState(false);

  const toggleMute = () => {
    setMute(!mute);
  };

  const toggleDeafen = () => {
    setDeafen(!deafen);
  };

  return (
    <MuteContext.Provider value={{ mute, toggleMute, deafen, toggleDeafen }}>
      {children}
    </MuteContext.Provider>
  );
};

export default MuteContext;
