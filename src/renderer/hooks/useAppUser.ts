import * as React from 'react';
import AppUserContext from '../contexts/AppUserContext';

const useAppUser = () => {
  return React.useContext(AppUserContext);
};

export default useAppUser;
