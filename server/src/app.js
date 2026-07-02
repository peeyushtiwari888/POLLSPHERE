import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

import authRoutes from './modules/auth/auth.routes.js';
import pollRoutes from './modules/poll/poll.routes.js';
import publicPollRoutes from './modules/publicPoll/publicPoll.routes.js';
import responseRoutes from './modules/response/response.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import eventRoutes from './modules/event/event.routes.js';
import liveRoutes from './modules/live/live.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window` for general APIs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Parses incoming JSON payloads
app.use(cookieParser()); // Parses cookies

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls/public', publicPollRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/admin', adminRoutes);

// Base route to verify server is running
app.get('/', (req, res) => {
  res.send('PollSphere API is running...');
});

export default app;
