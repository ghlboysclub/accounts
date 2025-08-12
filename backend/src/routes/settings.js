import { Hono } from 'hono';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';

const settings = new Hono();
settings.use('*', authMiddleware);
settings.use('*', requireAdmin);

// GET /api/settings - Get system settings
settings.get('/', async (c) => {
  try {
    const settingsResult = await c.env.DB.prepare(`
      SELECT setting_key, setting_value, setting_type, description, category, is_public
      FROM system_settings 
      ORDER BY category, setting_key
    `).all();

    // Group settings by category
    const settingsByCategory = {};
    for (const setting of settingsResult.results || []) {
      if (!settingsByCategory[setting.category]) {
        settingsByCategory[setting.category] = [];
      }
      settingsByCategory[setting.category].push(setting);
    }

    return c.json({
      success: true,
      data: {
        settings: settingsByCategory
      }
    });
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to retrieve settings' } }, 500);
  }
});

// PUT /api/settings/:key - Update setting
settings.put('/:key', async (c) => {
  try {
    const settingKey = c.req.param('key');
    const { value } = await c.req.json();
    const user = c.get('user');

    const result = await c.env.DB.prepare(`
      UPDATE system_settings 
      SET setting_value = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
      WHERE setting_key = ?
    `).bind(value, user.id, settingKey).run();

    if (result.changes === 0) {
      return c.json({ success: false, error: { message: 'Setting not found' } }, 404);
    }

    const updatedSetting = await c.env.DB.prepare(`
      SELECT * FROM system_settings WHERE setting_key = ?
    `).bind(settingKey).first();

    return c.json({
      success: true,
      data: { setting: updatedSetting },
      message: 'Setting updated successfully'
    });
  } catch (error) {
    return c.json({ success: false, error: { message: 'Failed to update setting' } }, 500);
  }
});

export default settings;
