import jwt from 'jsonwebtoken';

/**
 * Generate a JWT Access Token
 * @param {Object} payload - Data to be embedded in the token (e.g., { id: userId })
 * @param {string} [expiresIn='7d'] - Expiration time (default 7 days)
 * @returns {string} - Signed JWT token
 */
export const generateAccessToken = (payload, expiresIn = '7d') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT Access Token
 * @param {string} token - The JWT token to verify
 * @returns {Object} - Decoded payload if token is valid
 * @throws {Error} - Throws error if token is invalid or expired
 */
export const verifyAccessToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};
