import React, { useEffect } from 'react';
import './App.css';
import './styles/layout.css';
import AppRoutes from './routes';

// PUBLIC_INTERFACE
function App() {
  // default to light theme as per project style
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
