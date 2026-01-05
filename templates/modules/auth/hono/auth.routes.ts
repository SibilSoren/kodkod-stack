import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { authController } from '../../auth/auth.controller.js';

const auth = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Public routes
auth.post('/register', authController.register.bind(authController));
auth.post('/login', authController.login.bind(authController));

// Protected routes
auth.use('/me', jwt({ secret: JWT_SECRET }));
auth.get('/me', async (c) => {
  const payload = c.get('jwtPayload');
  c.set('user', { userId: payload.userId, email: payload.email });
  return authController.me(c);
});

export default auth;
