import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema.js';
import { config } from './index.js';

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment');
}

const queryClient = postgres(config.databaseUrl);
const db = drizzle(queryClient, { schema });

export { db };
