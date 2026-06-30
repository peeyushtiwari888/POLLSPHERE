import express from 'express';
import * as authController from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { protect } from '../../common/middleware/auth.middleware.js';

const router = express.Router();

// Authentication Routes

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), authController.register);

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', validate(loginSchema), authController.login);


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
router.post('/forgot-password', authController.forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset Password
// @access  Public
router.post('/reset-password/:token', authController.resetPassword);

export default router;
