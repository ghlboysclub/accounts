import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
const transactions = new Hono();
transactions.use('*', authMiddleware);
transactions.get('/', async (c) => c.json({ success: true, message: 'Transactions endpoint - Coming soon' }));
export default transactions;
