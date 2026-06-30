import { Server } from 'socket.io';
import { registerSocketEvents } from './socketEvents.js';

let io;

/**
 * Initialize the Socket.io server
 * We pass the main Express HTTP server so Socket.io can attach to the same port.
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Allow any origin for development, or mirror the requesting origin
        callback(null, origin || true);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Handle client connections
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Register modular event listeners
    registerSocketEvents(socket);

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get the initialized Socket.io instance
 * Use this in controllers or services to emit events (e.g., when a new response is submitted).
 */
export const getSocketIo = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};
