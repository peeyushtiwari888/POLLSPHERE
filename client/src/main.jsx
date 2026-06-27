import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import global font (Make sure @fontsource/inter is installed, or remove if using Google Fonts in index.html)
import '@fontsource/inter';

// Import global styles (Tailwind & Design System)
import './index.css';

// Import root App component
import App from './App.jsx';

/**
 * We create the React root element and render the application inside it.
 * StrictMode is used to highlight potential problems in the application during development.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter provides routing context to all nested components */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
