import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from './auth.service.js';

interface AuthBody {
  email: string;
  password: string;
  name?: string;
}

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export class AuthController {
  async register(request: FastifyRequest<{ Body: AuthBody }>, reply: FastifyReply) {
    try {
      const { email, password, name } = request.body;

      if (!email || !password) {
        return reply.status(400).send({ error: 'Email and password are required' });
      }

      const result = await authService.register({ email, password, name });
      return reply.status(201).send(result);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async login(request: FastifyRequest<{ Body: AuthBody }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.status(400).send({ error: 'Email and password are required' });
      }

      const result = await authService.login({ email, password });
      return reply.send(result);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(401).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async me(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Not authenticated' });
      }

      const user = await authService.getCurrentUser(request.user.userId);
      return reply.send(user);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(404).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}

export const authController = new AuthController();
