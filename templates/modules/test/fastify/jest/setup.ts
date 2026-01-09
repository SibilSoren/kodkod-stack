import Fastify, { FastifyInstance } from 'fastify';

// Mock database before importing routes
jest.mock('../src/db/index', () => ({
  db: {},
}));

let app: FastifyInstance;

beforeAll(async () => {
  app = Fastify();
  // TODO: Register your routes here
  // const routes = await import('../src/api/router');
  // await app.register(routes.default);
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

export { app };
