import * as React from 'react';
import FirebaseContext from '../contexts/FirebaseContext';

const useFirebase = () => {
  return React.useContext(FirebaseContext);
};

export default useFirebase;
