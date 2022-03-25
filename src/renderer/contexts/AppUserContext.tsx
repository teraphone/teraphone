import * as React from 'react';
import { User } from '../models/models';

type AppUserCtx = {
  appUser: User;
  setAppUser: (appUser: User) => void;
};

const AppUserContext = React.createContext({} as AppUserCtx);

export const AppUserProvider: React.FC = ({ children }) => {
  const [appUser, setAppUser] = React.useState<User>({
    id: 0,
    created_at: '',
    updated_at: '',
    name: '',
    email: '',
  });

  return (
    <AppUserContext.Provider value={{ appUser, setAppUser }}>
      {children}
    </AppUserContext.Provider>
  );
};

export default AppUserContext;
