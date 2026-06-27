import jwt from 'jsonwebtoken';
import User from './auth.model.js';

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
