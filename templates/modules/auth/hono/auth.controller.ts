import { Context } from 'hono';
import { authService } from './auth.service.js';

export class AuthController {
  async register(c: Context) {
    try {
      const { email, password, name } = await c.req.json();

      if (!email || !password) {
        return c.json({ error: 'Email and password are required' }, 400);
      }

      const result = await authService.register({ email, password, name });
      return c.json(result, 201);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async login(c: Context) {
    try {
      const { email, password } = await c.req.json();

      if (!email || !password) {
        return c.json({ error: 'Email and password are required' }, 400);
      }

      const result = await authService.login({ email, password });
      return c.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 401);
      }
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async me(c: Context) {
    try {
      const user = c.get('user');
      if (!user) {
        return c.json({ error: 'Not authenticated' }, 401);
      }

      const currentUser = await authService.getCurrentUser(user.userId);
      return c.json(currentUser);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
}

export const authController = new AuthController();
