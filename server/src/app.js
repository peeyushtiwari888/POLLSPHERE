import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes.js';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads
app.use(cookieParser()); // Parses cookies

// Mount API Routes
app.use('/api/auth', authRoutes);

// Base route to verify server is running
app.get('/', (req, res) => {
  res.send('PollSphere API is running...');
});

export default app;
