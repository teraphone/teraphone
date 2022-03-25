import * as React from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getDatabase, Database, ref, set, onValue } from 'firebase/database';
import {
  getAuth,
  signInWithCustomToken,
  Auth,
  UserCredential,
} from 'firebase/auth';

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
  database: Database;
  signIn: (token: string) => Promise<UserCredential>;
}

const FirebaseContext = React.createContext({} as FirebaseState);

export const FirebaseProvider: React.FC = ({ children }) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);

  const signIn = async (token: string) => {
    const userCredential = await signInWithCustomToken(auth, token);
    return userCredential;
  };

  return (
    <FirebaseContext.Provider value={{ app, database, signIn }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
