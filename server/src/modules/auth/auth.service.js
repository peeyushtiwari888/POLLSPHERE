import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from './auth.model.js';
import sendEmail from '../../common/utils/sendEmail.js';

/**
 * Helper: Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token valid for 7 days
  });
};

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  const { username, email, password } = userData;

  // Business Logic: Prevent duplicate registration
  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    const isEmailError = userExists.email === email;
    throw new Error(isEmailError ? 'User with this email already exists' : 'Username is already taken');
  }

  // Password hashing is handled automatically by the pre-save hook in the User model
  const user = await User.create({
    username,
    email,
    password,
  });

  const token = generateToken(user._id);

  // toJSON() automatically removes the password based on our schema definition
  const userResponse = user.toJSON();

  return { user: userResponse, token };
};

/**
 * Authenticate and login user
 */
export const loginUser = async (email, password) => {
  // Business Logic: Explicitly select the password field as it is hidden by default in the schema
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.isBlocked) {
    throw new Error('Your account has been blocked by an administrator.');
  }

  // Verify password using the instance method defined in the model
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);
  const userResponse = user.toJSON();

  return { user: userResponse, token };
};


/**
 * Get current authenticated user details
 */
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Logout user
 * In stateless JWT authentication, actual logout primarily involves clearing the token
 * on the client-side (e.g., clearing the cookie in the controller).
 * This service method can be expanded later if you implement token blacklisting in Redis/DB.
 */
export const logoutUser = async () => {
  return { success: true, message: 'Logged out successfully' };
};

/**
 * Initiate Forgot Password
 */
export const forgotPassword = async (email, origin) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('There is no user with that email address.');
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // For frontend URL, we fallback to typical vite port if origin is backend URL, 
  // but better to rely on origin header or env variable
  const clientUrl = process.env.CLIENT_URL || origin.replace('5000', '5173');
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message
    });
    return { success: true, message: 'Email sent' };
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error('Email could not be sent');
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (resetToken, newPassword) => {
  // Hash token to compare with DB
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Password reset token is invalid or has expired.');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return { success: true, message: 'Password has been reset successfully' };
};
