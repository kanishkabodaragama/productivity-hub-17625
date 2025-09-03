import React, { useEffect } from 'react';
import './App.css';
import './styles/layout.css';
import AppRoutes from './routes';

// PUBLIC_INTERFACE
function App() {
  // Initialize theme preference on mount using localStorage or default to light
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tm_theme');
      const theme = saved === 'dark' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (_e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
