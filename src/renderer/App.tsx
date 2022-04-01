import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import { AuthProvider } from './contexts/AuthContext';
import { MuteProvider } from './contexts/MuteContext';
import { RoomProvider } from './contexts/RoomContext';
import { CurrentRoomProvider } from './contexts/CurrentRoomContext';
import { ConnectionProvider } from './contexts/ConnectionContext';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { store } from './redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <MuteProvider>
          <RoomProvider>
            <CurrentRoomProvider>
              <ConnectionProvider>
                <FirebaseProvider>
                  <Router>
                    <Routes>
                      <Route path="/" element={<SignIn />} />
                      <Route path="/signin" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/home" element={<Home />} />
                    </Routes>
                  </Router>
                </FirebaseProvider>
              </ConnectionProvider>
            </CurrentRoomProvider>
          </RoomProvider>
        </MuteProvider>
      </AuthProvider>
    </Provider>
  );
}
