import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SuccessPage } from './pages/SuccessPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;