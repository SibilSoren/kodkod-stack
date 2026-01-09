import { vi } from 'vitest';
import { Hono } from 'hono';
import { router } from '../src/api/router.js';

// Mock database
vi.mock('../src/config/db.js', () => ({
  db: {},
}));

const app = new Hono();
app.route('/api', router);

export { app };
