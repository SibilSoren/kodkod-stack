import { db } from '../config/db.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export class UserRepository {
  constructor(private readonly client: typeof db) {}

  async findAll() {
    return this.client.select().from(users);
  }

  async findById(id: string) {
    const result = await this.client
      .select()
      .from(users)
      .where(eq(users.id, id));
    return result[0];
  }

  async create(data: any) {
    const result = await this.client
      .insert(users)
      .values(data)
      .returning();
    return result[0];
  }
}
