import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import NotFound from './screens/NotFound';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
  );
}

export default App;
