import { getSocketIo } from './socket.js';

/**
 * Register all Socket.io event listeners for a newly connected client.
 */
export const registerSocketEvents = (socket) => {
  
  const broadcastActiveUsers = (pollId) => {
    try {
      const io = getSocketIo();
      const room = io.sockets.adapter.rooms.get(pollId);
      // The number of active sockets connected to this poll's room
      const count = room ? room.size : 0;
      io.to(pollId).emit('active-users-update', count);
    } catch (err) {
      console.error('Failed to broadcast active users:', err);
    }
  };

  socket.on('join-poll', (pollId) => {
    if (pollId) {
      socket.join(pollId);
      console.log(`Socket ${socket.id} joined poll room: ${pollId}`);
      broadcastActiveUsers(pollId);
    }
  });

  socket.on('leave-poll', (pollId) => {
    if (pollId) {
      socket.leave(pollId);
      console.log(`Socket ${socket.id} left poll room: ${pollId}`);
      broadcastActiveUsers(pollId);
    }
  });

  socket.on('join-live-room', (pollId) => {
    if (pollId) {
      socket.join(pollId);
      console.log(`Socket ${socket.id} joined live room: ${pollId}`);
      broadcastActiveUsers(pollId);
    }
  });

  socket.on('leave-live-room', (pollId) => {
    if (pollId) {
      socket.leave(pollId);
      console.log(`Socket ${socket.id} left live room: ${pollId}`);
      broadcastActiveUsers(pollId);
    }
  });

  // Handle live reactions
  socket.on('send-reaction', ({ pollId, reaction }) => {
    if (pollId && reaction) {
      const io = getSocketIo();
      io.to(pollId).emit('receive-reaction', reaction);
    }
  });

  // Handle sudden disconnects (e.g. closing the tab)
  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        // The socket is still in the room during the 'disconnecting' event, 
        // so we wait until the next tick (when it has actually left) to recount.
        setTimeout(() => broadcastActiveUsers(room), 0);
      }
    }
  });
};
