import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { config } from './config/index.js';
import { router } from './api/router.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Routes
app.route('/api', router);

// Error Handling
app.onError(errorHandler);

const port = Number(config.port) || 3000;

console.log(`🚀 Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
