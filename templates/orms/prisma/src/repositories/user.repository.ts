import { PrismaClient } from '@prisma/client';

export class UserRepository {
  constructor(private db: PrismaClient) {}

  async findAll() {
    return this.db.user.findMany();
  }

  async findById(id: string) {
    return this.db.user.findById(id);
  }

  async create(data: any) {
    return this.db.user.create({ data });
  }
}
