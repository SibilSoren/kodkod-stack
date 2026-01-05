import { Context } from 'hono';
import { UserService } from '../services/user.service.js';

export class UserController {
  constructor(private userService: UserService) {}

  async getAll(c: Context) {
    try {
      const users = await this.userService.findAll();
      return c.json(users);
    } catch (error) {
      throw error;
    }
  }

  async getById(c: Context) {
    try {
      const id = c.req.param('id');
      const user = await this.userService.findById(id);
      if (!user) {
        return c.json({ message: 'User not found' }, 404);
      }
      return c.json(user);
    } catch (error) {
      throw error;
    }
  }

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const user = await this.userService.create(body);
      return c.json(user, 201);
    } catch (error) {
      throw error;
    }
  }
}
