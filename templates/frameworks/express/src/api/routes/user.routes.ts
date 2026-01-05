import { Router } from 'express';
import { UserController } from '../../controllers/user.controller.js';
import { UserService } from '../../services/user.service.js';
import { UserRepository } from '../../repositories/user.repository.js';
import { db } from '../../config/db.js';

const router = Router();

// Dependency Injection (Manual)
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/', (req, res, next) => userController.getAll(req, res, next));
router.get('/:id', (req, res, next) => userController.getById(req, res, next));
router.post('/', (req, res, next) => userController.create(req, res, next));

export { userRoutes: router };
