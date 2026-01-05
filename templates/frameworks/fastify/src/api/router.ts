import { FastifyInstance } from 'fastify';
import { userRoutes } from './routes/user.routes.js';

export async function router(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  await fastify.register(userRoutes, { prefix: '/users' });
}
