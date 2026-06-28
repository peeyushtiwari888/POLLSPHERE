import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes.js';
import pollRoutes from './modules/poll/poll.routes.js';
import publicPollRoutes from './modules/publicPoll/publicPoll.routes.js';
import responseRoutes from './modules/response/response.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import eventRoutes from './modules/event/event.routes.js';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Parses incoming JSON payloads
app.use(cookieParser()); // Parses cookies

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls/public', publicPollRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/events', eventRoutes);

// Base route to verify server is running
app.get('/', (req, res) => {
  res.send('PollSphere API is running...');
});

export default app;
