import { Hono } from 'hono';
import { authMiddleware, requireAdminOrPartner, canAccessPartner } from '../middleware/auth.js';

const investments = new Hono();
investments.use('*', authMiddleware);

// GET /api/investments - List investments
investments.get('/', async (c) => {
  try {
    const user = c.get('user');
    const page = parseInt(c.req.query('page')) || 1;
    const limit = Math.min(parseInt(c.req.query('limit')) || 20, 100);
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    // Role-based filtering
    if (user.role === 'partner') {
      whereClause += ' AND i.partner_id = ?';
      params.push(user.partner_id);
    }

    const investmentsResult = await c.env.DB.prepare(`
      SELECT i.*, p.name as partner_name, u.full_name as created_by_name
      FROM investments i
      JOIN partners p ON i.partner_id = p.id
      LEFT JOIN users u ON i.created_by = u.id
      ${whereClause}
      ORDER BY i.investment_date DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all();

    const totalResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as total FROM investments i ${whereClause}
    `).bind(...params).first();

    return c.json({
      success: true,
      data: {
        investments: investmentsResult.results || [],
        pagination: {
          page,
          limit,
          total: totalResult.total,
          total_pages: Math.ceil(totalResult.total / limit)
        }
      }
    });
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to retrieve investments' } }, 500);
  }
});

// POST /api/investments - Create investment
investments.post('/', requireAdminOrPartner, async (c) => {
  try {
    const user = c.get('user');
    const { partner_id, investment_type, amount, currency, description, investment_date, expected_return_rate, maturity_date } = await c.req.json();

    // Check if user can create investment for this partner
    if (user.role === 'partner' && user.partner_id !== partner_id) {
      return c.json({ success: false, error: { message: 'Access denied' } }, 403);
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO investments (partner_id, investment_type, amount, currency, description, investment_date, expected_return_rate, maturity_date, current_value, created_by, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).bind(partner_id, investment_type, amount, currency || 'PKR', description, investment_date, expected_return_rate, maturity_date, amount, user.id).run();

    const newInvestment = await c.env.DB.prepare('SELECT * FROM investments WHERE id = ?').bind(result.meta.last_row_id).first();
    
    return c.json({ success: true, data: { investment: newInvestment }, message: 'Investment created successfully' }, 201);
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to create investment' } }, 500);
  }
});

export default investments;
