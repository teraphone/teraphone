import * as React from 'react';

type Auth = {
  token: string;
  setToken: (s: string) => void;
};

const AuthContext = React.createContext({
  token: '',
  setToken: () => {},
} as Auth);

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = React.useState('');
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
