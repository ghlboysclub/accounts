// src/middleware/auth.js - FINAL FIX for JWT token generation

const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = 8 * 60 * 60; // 8 hours in seconds

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// =====================================================
// FIXED JWT IMPLEMENTATION
// =====================================================

function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

async function sign(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const encodedSignature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );
  
  return `${data}.${encodedSignature}`;
}

async function verify(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');
  
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  const signature = new Uint8Array([...base64UrlDecode(encodedSignature)].map(c => c.charCodeAt(0)));
  const isValid = await crypto.subtle.verify('HMAC', key, signature, new TextEncoder().encode(data));
  
  if (!isValid) throw new Error('Invalid signature');
  
  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    throw new Error('Token expired');
  }
  
  return payload;
}

// =====================================================
// JWT HELPER FUNCTIONS - FIXED
// =====================================================

export async function generateAccessToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    partner_id: user.partner_id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN,
    jti: generateUniqueId(),
    type: 'access'
  };

  return await sign(payload, JWT_SECRET);
}

export async function generateRefreshToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
    jti: generateUniqueId(),
    type: 'refresh'
  };

  return await sign(payload, JWT_SECRET);
}

export async function verifyToken(token) {
  return await verify(token, JWT_SECRET);
}

// =====================================================
// SESSION MANAGEMENT
// =====================================================

export async function createSession(db, userId, accessToken, refreshToken, ipAddress, userAgent) {
  await db.prepare('DELETE FROM user_sessions WHERE user_id = ?').bind(userId).run();

  const sessionData = {
    user_id: userId,
    session_token: accessToken,
    refresh_token: refreshToken,
    ip_address: ipAddress,
    user_agent: userAgent,
    expires_at: new Date(Date.now() + JWT_EXPIRES_IN * 1000).toISOString()
  };

  const result = await db.prepare(`
    INSERT INTO user_sessions (user_id, session_token, refresh_token, ip_address, user_agent, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    sessionData.user_id,
    sessionData.session_token,
    sessionData.refresh_token,
    sessionData.ip_address,
    sessionData.user_agent,
    sessionData.expires_at
  ).run();

  return result.meta.last_row_id;
}

export async function invalidateSession(db, sessionToken) {
  await db.prepare('DELETE FROM user_sessions WHERE session_token = ?').bind(sessionToken).run();
  await db.prepare(`
    INSERT OR IGNORE INTO token_blacklist (token, blacklisted_at, reason)
    VALUES (?, CURRENT_TIMESTAMP, 'user_logout')
  `).bind(sessionToken).run();
}

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

export async function authMiddleware(c, next) {
  try {
    const authHeader = c.req.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: { message: 'Authentication required', code: 'AUTH_REQUIRED' }
      }, 401);
    }

    const token = authHeader.substring(7);

    const blacklistedToken = await c.env.DB.prepare(
      'SELECT id FROM token_blacklist WHERE token = ?'
    ).bind(token).first();

    if (blacklistedToken) {
      return c.json({
        success: false,
        error: { message: 'Token has been revoked', code: 'TOKEN_REVOKED' }
      }, 401);
    }

    const payload = await verifyToken(token);

    if (payload.type !== 'access') {
      return c.json({
        success: false,
        error: { message: 'Invalid token type', code: 'INVALID_TOKEN_TYPE' }
      }, 401);
    }

    const session = await c.env.DB.prepare(`
      SELECT s.*, u.id, u.username, u.email, u.full_name, u.role, u.partner_id, u.status
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > CURRENT_TIMESTAMP
    `).bind(token).first();

    if (!session || session.status !== 'active') {
      return c.json({
        success: false,
        error: { message: 'Session invalid or user inactive', code: 'SESSION_INVALID' }
      }, 401);
    }

    const user = {
      id: session.id,
      username: session.username,
      email: session.email,
      full_name: session.full_name,
      role: session.role,
      partner_id: session.partner_id,
      status: session.status
    };

    c.set('user', user);
    await next();

  } catch (error) {
    return c.json({
      success: false,
      error: { message: 'Authentication failed', code: 'AUTH_FAILED', details: error.message }
    }, 401);
  }
}

export async function optionalAuth(c, next) {
  try {
    const authHeader = c.req.header('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await verifyToken(token);
      
      if (payload.type === 'access') {
        const session = await c.env.DB.prepare(`
          SELECT s.*, u.id, u.username, u.email, u.full_name, u.role, u.partner_id, u.status
          FROM user_sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.session_token = ? AND s.expires_at > CURRENT_TIMESTAMP
        `).bind(token).first();

        if (session && session.status === 'active') {
          const user = {
            id: session.id,
            username: session.username,
            email: session.email,
            full_name: session.full_name,
            role: session.role,
            partner_id: session.partner_id
          };
          c.set('user', user);
        }
      }
    }
    await next();
  } catch (error) {
    await next();
  }
}

export function requireAdmin(c, next) {
  const user = c.get('user');
  if (!user || user.role !== 'admin') {
    return c.json({
      success: false,
      error: { message: 'Admin access required', code: 'ADMIN_REQUIRED' }
    }, 403);
  }
  return next();
}

export function requireAdminOrPartner(c, next) {
  const user = c.get('user');
  if (!user || !['admin', 'partner'].includes(user.role)) {
    return c.json({
      success: false,
      error: { message: 'Admin or partner access required', code: 'PARTNER_ACCESS_REQUIRED' }
    }, 403);
  }
  return next();
}

export function canAccessPartner(user, partnerId) {
  if (user.role === 'admin') return true;
  if (user.role === 'partner' && user.partner_id === partnerId) return true;
  return false;
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt-change-in-production');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password, hashedPassword) {
  const inputHash = await hashPassword(password);
  return inputHash === hashedPassword;
}
