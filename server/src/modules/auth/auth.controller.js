import * as authService from './auth.service.js';
import { logActivity } from '../../common/services/activityLogger.js';

/**
 * Handle User Registration
 */
export const register = async (req, res) => {
  try {
    // Pass the request body to the service layer
    const { user, token } = await authService.registerUser(req.body);

    logActivity(user._id, 'USER_REGISTER', `User ${user.username} registered.`);

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return 201 Created status code for successful creation
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    // Return 400 Bad Request if validation or business logic fails
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

/**
 * Handle User Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Call the service layer to verify credentials
    const { user, token } = await authService.loginUser(email, password);

    logActivity(user._id, 'USER_LOGIN', `User ${user.username} logged in.`);

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return 200 OK for successful login
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: user,
    });
  } catch (error) {
    // Return 401 Unauthorized for bad credentials
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid credentials',
    });
  }
};


/**
 * Get Current Authenticated User
 */
export const getMe = async (req, res) => {
  try {
    // We assume 'req.user' will be populated by an authentication middleware
    const userId = req.user.id;
    
    const user = await authService.getCurrentUser(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found',
    });
  }
};

/**
 * Handle User Logout
 */
export const logout = async (req, res) => {
  try {
    const result = await authService.logoutUser();

    // Clear HTTP-only cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

/**
 * Handle Forgot Password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Get origin to construct reset URL (fallback if undefined)
    const origin = req.get('origin') || `${req.protocol}://${req.get('host')}`;

    const result = await authService.forgotPassword(email, origin);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Forgot password request failed',
    });
  }
};

/**
 * Handle Reset Password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await authService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Reset password failed',
    });
  }
};
