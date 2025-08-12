// src/routes/clients.js - Client Management Routes

import { Hono } from 'hono';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';

const clients = new Hono();
clients.use('*', authMiddleware);

// GET /api/clients - List clients
clients.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page')) || 1;
    const limit = Math.min(parseInt(c.req.query('limit')) || 20, 100);
    const offset = (page - 1) * limit;

    const clientsResult = await c.env.DB.prepare(`
      SELECT c.*, COUNT(t.id) as transaction_count, COALESCE(SUM(t.amount_pkr), 0) as total_value
      FROM clients c
      LEFT JOIN transactions t ON c.id = t.client_id
      GROUP BY c.id
      ORDER BY c.name
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();

    const totalResult = await c.env.DB.prepare('SELECT COUNT(*) as total FROM clients').first();

    return c.json({
      success: true,
      data: {
        clients: clientsResult.results || [],
        pagination: {
          page,
          limit,
          total: totalResult.total,
          total_pages: Math.ceil(totalResult.total / limit)
        }
      }
    });
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to retrieve clients' } }, 500);
  }
});

// GET /api/clients/:id - Get client details
clients.get('/:id', async (c) => {
  try {
    const clientId = parseInt(c.req.param('id'));
    const client = await c.env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();
    
    if (!client) {
      return c.json({ success: false, error: { message: 'Client not found' } }, 404);
    }

    return c.json({ success: true, data: { client } });
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to retrieve client' } }, 500);
  }
});

// POST /api/clients - Create client (Admin only)
clients.post('/', requireAdmin, async (c) => {
  try {
    const { name, email, phone, company, payment_terms, notes } = await c.req.json();
    
    const result = await c.env.DB.prepare(`
      INSERT INTO clients (name, email, phone, company, payment_terms, notes, active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).bind(name, email, phone, company, payment_terms, notes).run();

    const newClient = await c.env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(result.meta.last_row_id).first();
    
    return c.json({ success: true, data: { client: newClient }, message: 'Client created successfully' }, 201);
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to create client' } }, 500);
  }
});

export default clients;