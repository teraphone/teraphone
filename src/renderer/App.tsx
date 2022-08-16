import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import MSLogin from './components/MSLogin';
import Loading from './components/Loading';
import Home from './components/Home';
import { RoomProvider } from './contexts/RoomContext';
import { store } from './redux/store';
import theme from './styles/theme';
import LicenseCheck from './components/LicenseCheck';
import TrialExpired from './components/TrialExpired';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <RoomProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MSLogin />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/license-check" element={<LicenseCheck />} />
              <Route path="/trial-expired" element={<TrialExpired />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </Router>
        </RoomProvider>
      </Provider>
    </ThemeProvider>
  );
}
