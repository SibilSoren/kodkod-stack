import { vi, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import { router } from '../src/api/router.js';

// Mock database
vi.mock('../src/config/db.js', () => ({
  db: {},
}));

const app = Fastify();

beforeAll(async () => {
  await app.register(router, { prefix: '/api' });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

export { app };
