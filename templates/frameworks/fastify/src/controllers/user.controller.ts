import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service.js';

export class UserController {
  constructor(private userService: UserService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await this.userService.findAll();
      return reply.send(users);
    } catch (error) {
      return reply.status(500).send(error);
    }
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const user = await this.userService.findById(request.params.id);
      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }
      return reply.send(user);
    } catch (error) {
      return reply.status(500).send(error);
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await this.userService.create(request.body);
      return reply.status(201).send(user);
    } catch (error) {
      return reply.status(500).send(error);
    }
  }
}
