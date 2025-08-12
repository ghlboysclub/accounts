import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
const distributions = new Hono();
distributions.use('*', authMiddleware);
distributions.get('/', async (c) => c.json({ success: true, message: 'Distributions endpoint - Coming soon' }));
export default distributions;