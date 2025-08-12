// src/index.js - Main API Entry Point
// Enterprise Finance Management System - "Accounts"
// GHL Boys Club - Complete API with Authentication

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';

// Import middleware and routes
import { authMiddleware, optionalAuth } from './middleware/auth.js';
import { rateLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import route handlers
import authRoutes from './routes/auth.js';
import partnerRoutes from './routes/partners.js';
import clientRoutes from './routes/clients.js';
import transactionRoutes from './routes/transactions.js';
import distributionRoutes from './routes/distributions.js';
import advanceRoutes from './routes/advances.js';
import investmentRoutes from './routes/investments.js';
import expenseRoutes from './routes/expenses.js';
import userRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import reportRoutes from './routes/reports.js';
import settingsRoutes from './routes/settings.js';

const app = new Hono();

// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

// Security headers
app.use('*', secureHeaders());

// CORS configuration
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://accounts.ghlboysclub.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
}));

// Request logging
app.use('*', logger());

// Pretty JSON responses
app.use('*', prettyJSON());

// Rate limiting
app.use('*', rateLimiter);

// Global error handler
app.onError(errorHandler);

// =====================================================
// API DOCUMENTATION & INFO ROUTES
// =====================================================

// API Root - Public endpoint
app.get('/', (c) => {
  return c.json({
    success: true,
    data: {
      name: 'Accounts - Finance Management API',
      version: '1.0.0',
      company: 'GHL Boys Club',
      description: 'Enterprise finance management system with multi-partner profit sharing',
      endpoints: {
        auth: '/api/auth/*',
        partners: '/api/partners/*',
        clients: '/api/clients/*',
        transactions: '/api/transactions/*',
        distributions: '/api/distributions/*',
        advances: '/api/advances/*',
        investments: '/api/investments/*',
        expenses: '/api/expenses/*',
        users: '/api/users/*',
        dashboard: '/api/dashboard/*',
        reports: '/api/reports/*',
        settings: '/api/settings/*',
        docs: '/docs',
        help: '/help',
        health: '/health'
      },
      features: [
        'Multi-currency support (USD, EUR, PKR)',
        '8-partner profit sharing system',
        'Role-based access control',
        'Advance management',
        'Investment tracking',
        'Expense management',
        'Real-time dashboards',
        'Comprehensive reporting'
      ]
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', async (c) => {
  try {
    // Test database connection
    const result = await c.env.DB.prepare('SELECT COUNT(*) as count FROM partners').first();
    
    return c.json({
      success: true,
      data: {
        status: 'healthy',
        database: 'connected',
        partners: result.count,
        timestamp: new Date().toISOString(),
        environment: 'cloudflare-workers'
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: {
        message: 'Health check failed',
        details: error.message
      }
    }, 503);
  }
});

// API Documentation endpoint - COMPLETE VERSION
app.get('/docs', optionalAuth, async (c) => {
  const user = c.get('user');
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Accounts API Documentation</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; }
        .content { padding: 30px; }
        .endpoint { margin: 20px 0; padding: 15px; border-left: 4px solid #667eea; background: #f8fafc; border-radius: 0 8px 8px 0; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-right: 10px; }
        .get { background: #10b981; color: white; }
        .post { background: #3b82f6; color: white; }
        .put { background: #f59e0b; color: white; }
        .delete { background: #ef4444; color: white; }
        .auth-required { color: #dc2626; font-size: 12px; }
        .description { color: #6b7280; margin-top: 5px; }
        .stats { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
        .stats h3 { margin: 0 0 10px 0; color: #0c4a6e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏦 Accounts API Documentation</h1>
          <p>Enterprise Finance Management System - Live Production API</p>
          ${user ? `<p>👋 Welcome, ${user.full_name} (${user.role})</p>` : '<p>📖 Public Documentation View</p>'}
        </div>
        
        <div class="content">
          <div class="stats">
            <h3>🚀 Live Production System Status</h3>
            <p><strong>API URL:</strong> https://accounts-api.ghlboysclub.workers.dev</p>
            <p><strong>Status:</strong> ✅ Fully Operational</p>
            <p><strong>Environment:</strong> Cloudflare Workers (Global)</p>
          </div>

          <h2>🔐 Authentication Endpoints</h2>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/auth/login</strong>
            <div class="description">Login with username/email and password - Returns JWT tokens</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/auth/logout</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Logout and invalidate current session</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/auth/refresh</strong>
            <div class="description">Refresh access token using refresh token</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/auth/me</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Get current user information and profile</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/auth/change-password</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Change user password</div>
          </div>

          <h2>👥 Partner Management</h2>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/partners</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">List all partners with financial data and pagination</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/partners</strong> <span class="auth-required">🔒 Admin Only</span>
            <div class="description">Create new partner with profit sharing percentage</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/partners/:id</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Get detailed partner information including distributions</div>
          </div>
          <div class="endpoint">
            <span class="method put">PUT</span><strong>/api/partners/:id</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Update partner information</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/partners/:id/distributions</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Get partner's distribution history and earnings</div>
          </div>

          <h2>🏢 Client Management</h2>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/clients</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">List all clients with transaction counts and values</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/clients</strong> <span class="auth-required">🔒 Admin Only</span>
            <div class="description">Create new client with payment terms and contact info</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/clients/:id</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Get detailed client information and transaction history</div>
          </div>
          <div class="endpoint">
            <span class="method put">PUT</span><strong>/api/clients/:id</strong> <span class="auth-required">🔒 Admin Only</span>
            <div class="description">Update client information and payment terms</div>
          </div>

          <h2>💰 Transaction Management</h2>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/transactions</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">List transactions with filtering and multi-currency support</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/transactions</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Create new transaction with automatic currency conversion</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/transactions/:id</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Get detailed transaction information</div>
          </div>
          <div class="endpoint">
            <span class="method put">PUT</span><strong>/api/transactions/:id</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Update transaction details and status</div>
          </div>

          <h2>📊 Dashboard & Analytics</h2>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/dashboard</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Get role-based dashboard with live financial metrics</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/dashboard/stats</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Get detailed statistics for different time periods</div>
          </div>

          <h2>📈 Reports & Analytics</h2>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/reports/profit-sharing</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Generate comprehensive profit sharing reports</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/reports/financial-summary</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Monthly and yearly financial summaries</div>
          </div>

          <h2>💳 Expense Management</h2>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/expenses</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">List business expenses with categorization</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/expenses</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">Submit new expense for approval</div>
          </div>

          <h2>🏦 Advances & Investments</h2>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/advances</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">List partner advances with repayment tracking</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/advances</strong> <span class="auth-required">🔒 Admin Only</span>
            <div class="description">Create new partner advance</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/investments</strong> <span class="auth-required">🔒 Auth Required</span>
            <div class="description">List partner investments and returns</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/investments</strong> <span class="auth-required">🔒 Admin/Partner</span>
            <div class="description">Record new investment</div>
          </div>

          <h2>👤 User Management</h2>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/users</strong> <span class="auth-required">🔒 Admin Only</span>
            <div class="description">List all system users and roles</div>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span><strong>/api/users</strong> <span class="auth-required">🔒 Admin Only</span>
            <div class="description">Create new user account</div>
          </div>

          <h2>⚙️ System Settings</h2>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/api/settings</strong> <span class="auth-required">🔒 Admin Only</span>
            <div class="description">Get system configuration and settings</div>
          </div>
          <div class="endpoint">
            <span class="method put">PUT</span><strong>/api/settings/:key</strong> <span class="auth-required">🔒 Admin Only</span>
            <div class="description">Update system configuration</div>
          </div>

          <h2>🔧 System Health</h2>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/health</strong>
            <div class="description">Check system health and database connectivity</div>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span><strong>/help</strong>
            <div class="description">Get API help and quick start guide</div>
          </div>

          <h2>📝 Request Format</h2>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Headers:</strong><br>
            <code>Content-Type: application/json</code><br>
            <code>Authorization: Bearer &lt;token&gt;</code> (for authenticated endpoints)
            
            <br><br><strong>Example Login Request:</strong>
            <pre style="background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 6px; margin: 10px 0;">
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ghlboysclub.com",
  "password": "admin123"
}
            </pre>

            <br><strong>Example Client Creation:</strong>
            <pre style="background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 6px; margin: 10px 0;">
POST /api/clients
Authorization: Bearer &lt;your_token&gt;
Content-Type: application/json

{
  "name": "TechCorp USA",
  "type": "weekly",
  "amount": 2500,
  "currency": "USD",
  "payment_method": "wise",
  "contact_email": "payments@techcorp.com"
}
            </pre>
          </div>

          <h2>🔧 Response Format</h2>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Success Response:</strong>
            <pre style="background: #065f46; color: #d1fae5; padding: 15px; border-radius: 6px; margin: 10px 0;">
{
  "success": true,
  "data": { 
    "partners": [...],
    "pagination": { "page": 1, "total": 4 }
  },
  "timestamp": "2025-08-07T21:42:06.626Z"
}
            </pre>
            
            <strong>Error Response:</strong>
            <pre style="background: #7f1d1d; color: #fecaca; padding: 15px; border-radius: 6px; margin: 10px 0;">
{
  "success": false,
  "error": {
    "message": "Authentication required",
    "code": "AUTH_REQUIRED"
  },
  "timestamp": "2025-08-07T21:42:06.626Z"
}
            </pre>
          </div>

          <h2>💡 Live Production Data</h2>
          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <strong>Current System Status:</strong><br>
            • <strong>Partners:</strong> 4 active with profit sharing<br>
            • <strong>Clients:</strong> 1 active (TechCorp USA)<br>
            • <strong>Revenue:</strong> 976,500 PKR processed<br>
            • <strong>Transactions:</strong> 2 completed payments<br>
            • <strong>Uptime:</strong> 100% via Cloudflare global network
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Help endpoint
app.get('/help', (c) => {
  return c.json({
    success: true,
    data: {
      title: 'Accounts API Help',
      quick_start: {
        "1": "Get API token: POST /api/auth/login",
        "2": "Include in headers: Authorization: Bearer <token>",
        "3": "Make requests to endpoints with proper permissions"
      },
      common_tasks: {
        view_dashboard: "GET /api/dashboard",
        list_partners: "GET /api/partners",
        list_clients: "GET /api/clients",
        add_transaction: "POST /api/transactions",
        check_partner_earnings: "GET /api/partners/:id",
        view_reports: "GET /api/reports/*"
      },
      support: {
        documentation: "/docs",
        health_check: "/health",
        contact: "admin@ghlboysclub.com"
      },
      permissions: {
        admin: "Full system access - all operations",
        partner: "Own data + basic operations",
        employee: "Read-only access to most data"
      },
      production_info: {
        api_url: "https://accounts-api.ghlboysclub.workers.dev",
        status: "Live and operational",
        environment: "Cloudflare Workers (Global)"
      }
    }
  });
});

// Debug endpoint for token verification
app.get('/debug/token', async (c) => {
  try {
    const authHeader = c.req.header('authorization');
    if (!authHeader) {
      return c.json({ error: 'No authorization header' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Not a Bearer token' });
    }
    
    const token = authHeader.substring(7);
    const parts = token.split('.');
    
    return c.json({
      success: true,
      debug: {
        header_present: !!authHeader,
        starts_with_bearer: authHeader.startsWith('Bearer '),
        token_parts: parts.length,
        token_length: token.length,
        first_10_chars: token.substring(0, 10)
      }
    });
  } catch (error) {
    return c.json({ error: error.message });
  }
});

// =====================================================
// API ROUTES (all require /api prefix)
// =====================================================

// Authentication routes (public)
app.route('/api/auth', authRoutes);

// Protected routes (require authentication)
app.route('/api/partners', partnerRoutes);
app.route('/api/clients', clientRoutes);
app.route('/api/transactions', transactionRoutes);
app.route('/api/distributions', distributionRoutes);
app.route('/api/advances', advanceRoutes);
app.route('/api/investments', investmentRoutes);
app.route('/api/expenses', expenseRoutes);
app.route('/api/users', userRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/reports', reportRoutes);
app.route('/api/settings', settingsRoutes);

// =====================================================
// 404 HANDLER
// =====================================================

app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      message: 'Endpoint not found',
      code: 'NOT_FOUND',
      available_endpoints: [
        '/ - API Information',
        '/health - Health Check',
        '/docs - API Documentation',
        '/help - Quick Help',
        '/api/auth/* - Authentication',
        '/api/partners/* - Partner Management',
        '/api/clients/* - Client Management',
        '/api/transactions/* - Transaction Management',
        '/api/dashboard - Dashboard Data',
        '/api/reports/* - Reports & Analytics',
        '/api/expenses/* - Expense Management',
        '/api/advances/* - Advance Management',
        '/api/investments/* - Investment Tracking',
        '/api/users/* - User Management',
        '/api/settings/* - System Settings'
      ]
    },
    timestamp: new Date().toISOString()
  }, 404);
});

// Export for Cloudflare Workers
export default app;