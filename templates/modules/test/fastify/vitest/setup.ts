import { vi, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';

// Mock database before importing routes
vi.mock('../src/db/index.js', () => ({
  db: {},
}));

let app: FastifyInstance;

beforeAll(async () => {
  app = Fastify();
  // TODO: Register your routes here
  // const routes = await import('../src/api/router.js');
  // await app.register(routes.default);
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

export { app };
