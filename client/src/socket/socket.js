import { io } from 'socket.io-client';

/**
 * Socket.io Client Singleton
 * 
 * Establishes a persistent, reusable WebSocket connection to the backend server.
 * Completely decoupled from React/UI logic to ensure a single, globally shared connection.
 */

// 1. Determine the backend URL
// We read the VITE_API_URL from environment variables (e.g. 'http://localhost:5000/api')
// If not set, fallback to the current hostname.
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;
const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

// 2. Initialize the Socket instance
const socket = io(SOCKET_URL, {
  autoConnect: true,             // Connect automatically when imported
  reconnection: true,            // Enable automatic reconnection
  reconnectionAttempts: Infinity,// Keep trying to reconnect forever
  reconnectionDelay: 1000,       // Wait 1 second before first retry
  reconnectionDelayMax: 5000,    // Wait up to 5 seconds between retries
  withCredentials: true,         // Send cookies/authorization headers if required by CORS
});

// 3. Attach basic connection lifecycle listeners for debugging and resilience
socket.on('connect', () => {
  console.log(`[Socket.io] Connected to server successfully (ID: ${socket.id})`);
});

socket.on('disconnect', (reason) => {
  console.warn(`[Socket.io] Disconnected from server. Reason: ${reason}`);
  
  // If the server explicitly disconnected us, the socket won't auto-reconnect.
  // We force a manual reconnection in this specific edge case.
  if (reason === 'io server disconnect') {
    socket.connect();
  }
});

socket.on('connect_error', (error) => {
  console.error(`[Socket.io] Connection Error:`, error.message);
});

// Export the singleton instance to be used across the application
export default socket;
