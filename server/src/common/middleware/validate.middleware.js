/**
 * Middleware to validate incoming request data using Zod schemas
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ 
      body: req.body || {}, 
      query: req.query || {}, 
      params: req.params || {} 
    });
    next();
  } catch (err) {
    // If it's a Zod error, it will have an 'issues' array
    if (err && err.issues && err.issues.length > 0) {
      return res.status(400).json({
        success: false,
        message: err.issues[0].message,
      });
    }
    
    // If it's some other unexpected error, log it and return 500
    console.error("Validation Error:", err);
    return res.status(500).json({
      success: false,
      message: 'Server error during validation',
    });
  }
};
