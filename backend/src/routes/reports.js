import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';

const reports = new Hono();
reports.use('*', authMiddleware);

// GET /api/reports/profit-sharing - Profit sharing report
reports.get('/profit-sharing', async (c) => {
  try {
    const year = c.req.query('year') || new Date().getFullYear();
    const month = c.req.query('month');

    let dateFilter = `strftime('%Y', pd.distribution_date) = '${year}'`;
    if (month) {
      dateFilter += ` AND strftime('%m', pd.distribution_date) = '${month.padStart(2, '0')}'`;
    }

    const profitSharingData = await c.env.DB.prepare(`
      SELECT 
        p.name as partner_name,
        p.percentage,
        COUNT(pd.id) as total_transactions,
        COALESCE(SUM(pd.distribution_amount), 0) as total_distributed,
        COALESCE(SUM(CASE WHEN pd.status = 'paid' THEN pd.distribution_amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN pd.status = 'pending' THEN pd.distribution_amount ELSE 0 END), 0) as pending_amount
      FROM partners p
      LEFT JOIN partner_distributions pd ON p.id = pd.partner_id AND ${dateFilter}
      WHERE p.active = 1
      GROUP BY p.id, p.name, p.percentage
      ORDER BY p.percentage DESC
    `).all();

    return c.json({
      success: true,
      data: {
        report_period: { year, month },
        profit_sharing: profitSharingData.results || []
      }
    });
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to generate profit sharing report' } }, 500);
  }
});

// GET /api/reports/financial-summary - Financial summary report
reports.get('/financial-summary', async (c) => {
  try {
    const year = c.req.query('year') || new Date().getFullYear();

    const monthlyData = await c.env.DB.prepare(`
      SELECT 
        strftime('%m', transaction_date) as month,
        COUNT(*) as transaction_count,
        COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount_pkr ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount_pkr ELSE 0 END), 0) as expenses,
        COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount_pkr ELSE -amount_pkr END), 0) as net_profit
      FROM transactions 
      WHERE strftime('%Y', transaction_date) = ? AND status = 'completed'
      GROUP BY strftime('%m', transaction_date)
      ORDER BY month
    `).bind(year).all();

    return c.json({
      success: true,
      data: {
        year,
        monthly_summary: monthlyData.results || []
      }
    });
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to generate financial summary' } }, 500);
  }
});

export default reports;
