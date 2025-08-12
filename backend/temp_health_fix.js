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
