import { Hono } from 'hono';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';

const users = new Hono();
users.use('*', authMiddleware);
users.use('*', requireAdmin);

// GET /api/users - List users
users.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page')) || 1;
    const limit = Math.min(parseInt(c.req.query('limit')) || 20, 100);
    const offset = (page - 1) * limit;
    const role = c.req.query('role'); // admin, partner, employee

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (role) {
      whereClause += ' AND u.role = ?';
      params.push(role);
    }

    const usersResult = await c.env.DB.prepare(`
      SELECT u.id, u.username, u.email, u.full_name, u.role, u.partner_id, u.phone, u.status, 
             u.last_login_at, u.created_at, p.name as partner_name
      FROM users u
      LEFT JOIN partners p ON u.partner_id = p.id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all();

    const totalResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as total FROM users u ${whereClause}
    `).bind(...params).first();

    return c.json({
      success: true,
      data: {
        users: usersResult.results || [],
        pagination: {
          page,
          limit,
          total: totalResult.total,
          total_pages: Math.ceil(totalResult.total / limit)
        }
      }
    });
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to retrieve users' } }, 500);
  }
});

// POST /api/users - Create user
users.post('/', async (c) => {
  try {
    const { username, email, password, full_name, role, partner_id, phone } = await c.req.json();
    
    // Basic validation
    if (!username || !email || !password || !full_name || !role) {
      return c.json({
        success: false,
        error: { message: 'Username, email, password, full_name, and role are required' }
      }, 400);
    }

    // Hash password (simplified for demo - use proper bcrypt in production)
    const passwordHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password + 'salt'));
    const hashedPassword = Array.from(new Uint8Array(passwordHash)).map(b => b.toString(16).padStart(2, '0')).join('');

    const result = await c.env.DB.prepare(`
      INSERT INTO users (username, email, password_hash, full_name, role, partner_id, phone, status, must_change_password)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', 1)
    `).bind(username, email, hashedPassword, full_name, role, partner_id, phone).run();

    const newUser = await c.env.DB.prepare(`
      SELECT id, username, email, full_name, role, partner_id, phone, status, created_at 
      FROM users WHERE id = ?
    `).bind(result.meta.last_row_id).first();
    
    return c.json({ 
      success: true, 
      data: { user: newUser }, 
      message: 'User created successfully' 
    }, 201);
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to create user' } }, 500);
  }
});

export default users;
