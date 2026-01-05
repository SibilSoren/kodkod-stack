import { Router } from 'express';
import { authController } from '../../auth/auth.controller.js';
import { authGuard } from '../../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Protected routes
router.get('/me', authGuard, authController.me.bind(authController));

export default router;
