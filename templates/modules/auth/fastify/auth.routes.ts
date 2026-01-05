import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { authController } from '../../auth/auth.controller.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    userId: string;
    email: string;
  };
}

async function authGuard(request: AuthenticatedRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
}

export default async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/auth/register', authController.register.bind(authController));
  fastify.post('/auth/login', authController.login.bind(authController));

  // Protected routes
  fastify.get('/auth/me', {
    preHandler: authGuard,
    handler: authController.me.bind(authController),
  });
}
