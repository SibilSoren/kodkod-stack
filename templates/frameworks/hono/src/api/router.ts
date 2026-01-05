import { Hono } from 'hono';
import { userRoutes } from './routes/user.routes.js';

const router = new Hono();

router.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.route('/users', userRoutes);

export { router };
