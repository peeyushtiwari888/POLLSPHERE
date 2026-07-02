import express from 'express';
import * as authController from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { protect } from '../../common/middleware/auth.middleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window`
  message: 'Too many authentication attempts from this IP, please try again later.'
});

// Authentication Routes

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, validate(registerSchema), authController.register);

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', authLimiter, validate(loginSchema), authController.login);


// @route   GET /api/auth/me
// @desc    Get current logged in user details
// @access  Private (Requires authentication)
router.get('/me', protect, authController.getMe);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private (Requires authentication)
router.post('/logout', protect, authController.logout);

// @route   POST /api/auth/forgot-password
// @desc    Forgot Password
// @access  Public
router.post('/forgot-password', authLimiter, authController.forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset Password
// @access  Public
router.post('/reset-password/:token', authController.resetPassword);

export default router;
