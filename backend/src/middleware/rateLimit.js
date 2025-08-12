// src/middleware/rateLimit.js - Rate Limiting Middleware

/**
 * Simple rate limiting middleware
 * Uses in-memory storage (in production, consider using KV or Durable Objects)
 */

const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 1000; // requests per window

export async function rateLimiter(c, next) {
  try {
    // Get client identifier (IP address or user ID if authenticated)
    const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
    const authHeader = c.req.header('authorization');
    
    let clientId = clientIp;
    
    // If authenticated, use user ID for more accurate limiting
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        // Simple token decode without verification for rate limiting purposes
        const token = authHeader.substring(7);
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          clientId = `user_${payload.sub}`;
        }
      } catch (e) {
        // Fallback to IP if token decode fails
        clientId = clientIp;
      }
    }

    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    // Clean up old entries
    for (const [key, data] of requestCounts.entries()) {
      data.requests = data.requests.filter(timestamp => timestamp > windowStart);
      if (data.requests.length === 0) {
        requestCounts.delete(key);
      }
    }
    
    // Get or create client data
    if (!requestCounts.has(clientId)) {
      requestCounts.set(clientId, { requests: [] });
    }
    
    const clientData = requestCounts.get(clientId);
    
    // Filter requests within current window
    clientData.requests = clientData.requests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (clientData.requests.length >= MAX_REQUESTS_PER_WINDOW) {
      const resetTime = new Date(Math.min(...clientData.requests) + RATE_LIMIT_WINDOW);
      
      return c.json({
        success: false,
        error: {
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retry_after: resetTime.toISOString()
        }
      }, 429);
    }
    
    // Add current request
    clientData.requests.push(now);
    
    // Add rate limit headers
    c.header('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
    c.header('X-RateLimit-Remaining', (MAX_REQUESTS_PER_WINDOW - clientData.requests.length).toString());
    c.header('X-RateLimit-Reset', new Date(now + RATE_LIMIT_WINDOW).toISOString());
    
    await next();
    
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Continue on error - don't block requests due to rate limiting issues
    await next();
  }
}