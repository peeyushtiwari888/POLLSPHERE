import jwt from 'jsonwebtoken';

/**
 * Middleware to protect routes by verifying JWT token
 */
export const protect = (req, res, next) => {
  let token;

  // Safely check if token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from 'Bearer <token>' string
    token = req.headers.authorization.split(' ')[1];
  } 
  // Fallback to reading from cookies (useful if we implement HTTP-only cookies later)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token is found in headers or cookies, deny access
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information (e.g., { id: '...' }) to the request object
    req.user = decoded;

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    // Handle specific error when the token has expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }

    // Handle generic invalid or malformed tokens
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Authorization denied.',
    });
  }
};

/**
 * Middleware that checks for a token but doesn't block if missing.
 * Useful for routes that support both anonymous and authenticated access.
 */
export const optionalProtect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token is found, just proceed without setting req.user
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    // If a token is provided but invalid, we still proceed as anonymous
    // (Or we can block. Usually it's better to proceed as anonymous or throw an error. 
    // We'll proceed without setting req.user)
    next();
  }
};
