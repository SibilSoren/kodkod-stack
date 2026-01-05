import { FastifyInstance } from 'fastify';
import { UserController } from '../../controllers/user.controller.js';
import { UserService } from '../../services/user.service.js';
import { UserRepository } from '../../repositories/user.repository.js';
import { db } from '../../config/db.js';

export async function userRoutes(fastify: FastifyInstance) {
  // Dependency Injection (Manual)
  // Note: In a real app, you might use a DI container or Fastify decorators
  const userRepository = new UserRepository(db);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  fastify.get('/', userController.getAll.bind(userController));
  fastify.get('/:id', userController.getById.bind(userController));
  fastify.post('/', userController.create.bind(userController));
}
