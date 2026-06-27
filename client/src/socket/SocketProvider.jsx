import React, { createContext, useContext, useEffect } from 'react';
import socket from './socket';

// Assuming we have an AuthContext to listen to the user's login state
import { AuthContext } from '../context/AuthContext';

// 1. Create and Export the Context
export const SocketContext = createContext(null);

/**
 * SocketProvider
 * 
 * Orchestrates the lifecycle of the Socket.io connection.
 * It listens to the global authentication state and connects/disconnects 
 * the socket accordingly to preserve resources and security.
 */
export const SocketProvider = ({ children }) => {
  // Grab the authentication state from our Auth Context
  const authContext = useContext(AuthContext);
  
  // Safely fallback in case AuthProvider isn't wrapping this correctly yet
  const isAuthenticated = authContext?.isAuthenticated || false;

  useEffect(() => {
    // -------------------------------------------------------------------------
    // Connect / Disconnect Logic
    // -------------------------------------------------------------------------
    if (isAuthenticated) {
      // User is logged in: Establish connection
      if (!socket.connected) {
        console.log('[SocketProvider] User authenticated. Connecting socket...');
        socket.connect();
      }
    } else {
      // User is logged out: Terminate connection
      if (socket.connected) {
        console.log('[SocketProvider] User logged out. Disconnecting socket...');
        socket.disconnect();
      }
    }

    // -------------------------------------------------------------------------
    // Cleanup on Unmount
    // -------------------------------------------------------------------------
    return () => {
      // We don't necessarily want to disconnect on every unmount (e.g. fast refresh),
      // but it's a good practice to ensure no ghost connections remain if the root unmounts.
      // We'll leave the connection alive unless they explicitly log out, 
      // but we can remove all event listeners to prevent memory leaks.
      socket.off(); 
    };
  }, [isAuthenticated]); // Only re-run if authentication state changes

  // Provide the singleton socket instance to all children
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};


