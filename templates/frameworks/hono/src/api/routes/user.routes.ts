import { Hono } from 'hono';
import { UserController } from '../../controllers/user.controller.js';
import { UserService } from '../../services/user.service.js';
import { UserRepository } from '../../repositories/user.repository.js';
import { db } from '../../config/db.js';

const userRoutes = new Hono();

// Dependency Injection (Manual)
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRoutes.get('/', (c) => userController.getAll(c));
userRoutes.get('/:id', (c) => userController.getById(c));
userRoutes.post('/', (c) => userController.create(c));

export { userRoutes };
