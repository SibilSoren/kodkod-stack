import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { config } from './config/index.js';
import { router } from './api/router.js';

const fastify = Fastify({
  logger: true
});

// Register Plugins
await fastify.register(cors);
await fastify.register(helmet);

// Register Routes
await fastify.register(router, { prefix: '/api' });

const port = Number(config.port) || 3000;

try {
  await fastify.listen({ port, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
