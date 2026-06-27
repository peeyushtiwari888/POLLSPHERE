/**
 * Register all Socket.io event listeners for a newly connected client.
 * We separate this from the main socket setup to keep the code modular and clean.
 */
export const registerSocketEvents = (socket) => {
  
  /**
   * Event: join-poll
   * Purpose: When a user visits a poll page or analytics page, they join a specific "room".
   * This allows the server to broadcast live vote updates ONLY to the users inside this room,
   * instead of spamming all connected users on the website.
   */
  socket.on('join-poll', (pollId) => {
    if (pollId) {
      socket.join(pollId);
      console.log(`Socket ${socket.id} joined poll room: ${pollId}`);
    }
  });

  /**
   * Event: leave-poll
   * Purpose: When a user navigates away from the poll page, they should leave the room
   * so they stop receiving unnecessary live updates.
   */
  socket.on('leave-poll', (pollId) => {
    if (pollId) {
      socket.leave(pollId);
      console.log(`Socket ${socket.id} left poll room: ${pollId}`);
    }
  });

};
