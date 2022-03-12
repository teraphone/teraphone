import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import { AuthProvider } from './contexts/AuthContext';
import { MuteProvider } from './contexts/MuteContext';
import { RoomProvider } from './contexts/RoomContext';
import { CurrentRoomProvider } from './contexts/CurrentRoomContext';

export default function App() {
  return (
    <AuthProvider>
      <MuteProvider>
        <RoomProvider>
          <CurrentRoomProvider>
            <Router>
              <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/home" element={<Home />} />
              </Routes>
            </Router>
          </CurrentRoomProvider>
        </RoomProvider>
      </MuteProvider>
    </AuthProvider>
  );
}
