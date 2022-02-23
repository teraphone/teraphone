import * as React from 'react';

type AuthState = {
  token: string;
  expiration: number;
};

type Auth = {
  state: AuthState;
  setState: (s: AuthState) => void;
};

const AuthContext = React.createContext({} as Auth);

export const AuthProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState({} as AuthState);
  return (
    <AuthContext.Provider value={{ state, setState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
