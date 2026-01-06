import { swaggerUI } from '@hono/swagger-ui';
import { Hono } from 'hono';

export const setupSwagger = (app: Hono) => {
  app.get(
    '/docs',
    swaggerUI({
      url: '/api/openapi.json',
    })
  );

  app.get('/api/openapi.json', (c) => {
    return c.json({
      openapi: '3.0.0',
      info: {
        title: 'Kodkod API',
        version: '1.0.0',
        description: 'API documentation for your Kodkod project',
      },
      servers: [
        {
          url: 'http://localhost:3000/api',
          description: 'Development server',
        },
      ],
      paths: {}, // Hono users often use Zod-to-OpenAPI for this
    });
  });
};
