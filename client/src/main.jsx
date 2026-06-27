import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './socket/SocketProvider';

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
    <BrowserRouter>
      {/* ThemeProvider manages light/dark mode state across the app */}
      <ThemeProvider>
        {/* AuthProvider makes authentication state globally accessible */}
        <AuthProvider>
          <SocketProvider>
            <App />
            
            {/* Toaster renders the global toast notifications (success/error popups) */}
            <Toaster 
              position="bottom-right"
              toastOptions={{
                // Premium SaaS aesthetic tweaks for toasts
                className: 'dark:bg-zinc-900 dark:text-white',
                style: {
                  borderRadius: '12px',
                },
              }} 
            />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
