import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import HomePage from './pages/HomePage';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;