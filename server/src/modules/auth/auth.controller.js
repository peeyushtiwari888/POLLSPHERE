import * as authService from './auth.service.js';

/**
 * Handle User Registration
 */
export const register = async (req, res) => {
  try {
    // Pass the request body to the service layer
    const { user, token } = await authService.registerUser(req.body);

    // Return 201 Created status code for successful creation
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
      token, // The frontend will store this token (e.g., in localStorage)
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

    // Return 200 OK for successful login
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: user,
      token,
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
 * Handle Google Login
 */
export const googleLogin = async (req, res) => {
  try {
    const { token: idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Google token is required' });
    }

    const { user, token } = await authService.googleLogin(idToken);

    res.status(200).json({
      success: true,
      message: 'Logged in with Google successfully',
      data: user,
      token,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Google authentication failed',
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

    // Note: In a stateless JWT setup where the token is in localStorage,
    // actual logout happens on the frontend by deleting the token.
    // If we used HTTP-only cookies, we would use res.clearCookie('token') here.

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
