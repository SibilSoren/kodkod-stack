import { Router } from 'express';
import { userRoutes } from './routes/user.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/users', userRoutes);

export { router };
