import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
const advances = new Hono();
advances.use('*', authMiddleware);
advances.get('/', async (c) => c.json({ success: true, message: 'Advances endpoint - Coming soon' }));
export default advances;