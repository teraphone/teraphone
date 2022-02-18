import * as React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
      </Routes>
    </Router>
  );
}
