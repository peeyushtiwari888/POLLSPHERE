import 'dotenv/config';
import app from './app.js';
import connectDB from './common/config/db.js';
import { initSocket } from './socket.js';
import { initPollCronJobs } from './modules/poll/poll.cron.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the server
connectDB().then(() => {
  // app.listen returns the raw http.Server instance
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Attach Socket.io to the same HTTP server so they share the same port
  initSocket(server);

  // Initialize Background Cron Jobs
  initPollCronJobs();
}).catch(err => {
  console.error("Failed to connect to the database:", err.message);
});
