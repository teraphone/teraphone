import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import LocalVideoView from './components/LocalVideoView';
import { RoomProvider } from './contexts/RoomContext';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { store } from './redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <RoomProvider>
        <FirebaseProvider>
          <Router>
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<Home />} />
              <Route path="/localvideo" element={<LocalVideoView />} />
            </Routes>
          </Router>
        </FirebaseProvider>
      </RoomProvider>
    </Provider>
  );
}
