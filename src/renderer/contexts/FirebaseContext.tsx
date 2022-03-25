import * as React from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getDatabase, Database, ref, set, onValue } from 'firebase/database';
import { getAuth, signInWithCustomToken, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDPFJHANvIyx-7OHZl-8UEI7vFOgaShaPI',
  authDomain: 'livekit-demo.firebaseapp.com',
  databaseURL: 'https://dally-arty.firebaseio.com/',
  projectId: 'livekit-demo',
  storageBucket: 'livekit-demo.appspot.com',
  messagingSenderId: '543196966940',
  appId: '1:543196966940:web:673abeab10b5b92903efd9',
};

export interface FirebaseState {
  app: FirebaseApp;
  auth: Auth;
  database: Database;
}

const FirebaseContext = React.createContext({} as FirebaseState);

export const FirebaseProvider: React.FC = ({ children }) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  return (
    <FirebaseContext.Provider value={{ app, auth, database }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
