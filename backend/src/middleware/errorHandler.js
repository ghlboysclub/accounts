// src/middleware/errorHandler.js - Global Error Handler

/**
 * Global error handler for the API
 * Standardizes error responses and handles different error types
 */
export function errorHandler(err, c) {
    console.error('API Error:', err);
  
    // Default error response
    let statusCode = 500;
    let errorResponse = {
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      timestamp: new Date().toISOString()
    };
  
    // Handle specific error types
    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorResponse.error = {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err.details || err.message
      };
    } else if (err.name === 'AuthenticationError') {
      statusCode = 401;
      errorResponse.error = {
        message: 'Authentication failed',
        code: 'AUTH_ERROR'
      };
    } else if (err.name === 'AuthorizationError') {
      statusCode = 403;
      errorResponse.error = {
        message: 'Access forbidden',
        code: 'ACCESS_FORBIDDEN'
      };
    } else if (err.name === 'NotFoundError') {
      statusCode = 404;
      errorResponse.error = {
        message: 'Resource not found',
        code: 'NOT_FOUND'
      };
    } else if (err.message) {
      errorResponse.error.message = err.message;
    }
  
    // Add stack trace in development (you can set a flag for this)
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = err.stack;
    }
  
    return c.json(errorResponse, statusCode);
  }