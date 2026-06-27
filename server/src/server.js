import 'dotenv/config';
import app from './app.js';
import connectDB from './common/config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to the database:", err.message);
});
