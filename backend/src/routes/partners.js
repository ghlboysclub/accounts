// src/routes/partners.js - Simplified Partners Routes

import { Hono } from 'hono';
import { authMiddleware, requireAdmin, canAccessPartner } from '../middleware/auth.js';

const partners = new Hono();

// All partner routes require authentication
partners.use('*', authMiddleware);

/**
 * GET /api/partners
 * List all partners (simplified version)
 */
partners.get('/', async (c) => {
  try {
    const user = c.get('user');
    console.log('Partners - User:', user); // Debug log
    
    const page = parseInt(c.req.query('page')) || 1;
    const limit = Math.min(parseInt(c.req.query('limit')) || 20, 100);
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM partners';
    let countQuery = 'SELECT COUNT(*) as total FROM partners';
    let params = [];

    // Role-based filtering
    if (user.role === 'partner' && user.partner_id) {
      query += ' WHERE id = ?';
      countQuery += ' WHERE id = ?';
      params.push(user.partner_id);
    }

    query += ' ORDER BY percentage DESC, name LIMIT ? OFFSET ?';
    
    console.log('Executing query:', query, 'with params:', [...params, limit, offset]); // Debug log

    const partnersResult = await c.env.DB.prepare(query).bind(...params, limit, offset).all();
    console.log('Partners result:', partnersResult); // Debug log
    
    const totalResult = await c.env.DB.prepare(countQuery).bind(...params).first();
    console.log('Total result:', totalResult); // Debug log

    return c.json({
      success: true,
      data: {
        partners: partnersResult.results || [],
        pagination: {
          page,
          limit,
          total: totalResult?.total || 0,
          total_pages: Math.ceil((totalResult?.total || 0) / limit)
        },
        user_role: user.role
      }
    });

  } catch (error) {
    console.error('Get partners error:', error);
    return c.json({
      success: false,
      error: {
        message: 'Failed to retrieve partners',
        code: 'GET_PARTNERS_ERROR',
        details: error.message
      }
    }, 500);
  }
});

/**
 * GET /api/partners/:id
 * Get specific partner details
 */
partners.get('/:id', async (c) => {
  try {
    const partnerId = parseInt(c.req.param('id'));
    const user = c.get('user');

    // Check access permission
    if (!canAccessPartner(user, partnerId)) {
      return c.json({
        success: false,
        error: {
          message: 'Access denied',
          code: 'ACCESS_DENIED'
        }
      }, 403);
    }

    const partner = await c.env.DB.prepare(
      'SELECT * FROM partners WHERE id = ?'
    ).bind(partnerId).first();

    if (!partner) {
      return c.json({
        success: false,
        error: {
          message: 'Partner not found',
          code: 'PARTNER_NOT_FOUND'
        }
      }, 404);
    }

    return c.json({
      success: true,
      data: {
        partner,
        recent_distributions: []
      }
    });

  } catch (error) {
    console.error('Get partner error:', error);
    return c.json({
      success: false,
      error: {
        message: 'Failed to retrieve partner',
        code: 'GET_PARTNER_ERROR',
        details: error.message
      }
    }, 500);
  }
});

export default partners;
