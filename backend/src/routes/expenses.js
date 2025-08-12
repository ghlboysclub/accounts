import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';

const expenses = new Hono();
expenses.use('*', authMiddleware);

// GET /api/expenses - List expenses
expenses.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page')) || 1;
    const limit = Math.min(parseInt(c.req.query('limit')) || 20, 100);
    const offset = (page - 1) * limit;
    const status = c.req.query('status'); // pending, approved, rejected, paid

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const expensesResult = await c.env.DB.prepare(`
      SELECT e.*, u.full_name as requested_by_name, u2.full_name as approved_by_name
      FROM expenses e
      LEFT JOIN users u ON e.requested_by = u.id
      LEFT JOIN users u2 ON e.approved_by = u2.id
      ${whereClause}
      ORDER BY e.expense_date DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all();

    const totalResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as total FROM expenses ${whereClause}
    `).bind(...params).first();

    return c.json({
      success: true,
      data: {
        expenses: expensesResult.results || [],
        pagination: {
          page,
          limit,
          total: totalResult.total,
          total_pages: Math.ceil(totalResult.total / limit)
        }
      }
    });
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to retrieve expenses' } }, 500);
  }
});

// POST /api/expenses - Create expense
expenses.post('/', async (c) => {
  try {
    const user = c.get('user');
    const { category, subcategory, description, amount, currency, vendor, expense_date, payment_method, receipt_url } = await c.req.json();

    const result = await c.env.DB.prepare(`
      INSERT INTO expenses (category, subcategory, description, amount, currency, vendor, expense_date, payment_method, receipt_url, requested_by, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).bind(category, subcategory, description, amount, currency || 'PKR', vendor, expense_date, payment_method, receipt_url, user.id).run();

    const newExpense = await c.env.DB.prepare('SELECT * FROM expenses WHERE id = ?').bind(result.meta.last_row_id).first();
    
    return c.json({ success: true, data: { expense: newExpense }, message: 'Expense created successfully' }, 201);
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to create expense' } }, 500);
  }
});

export default expenses;
