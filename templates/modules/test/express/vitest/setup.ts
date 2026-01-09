import { vi } from 'vitest';
import express from 'express';
import { router } from '../src/api/router.js';

// Mock database
vi.mock('../src/config/db.js', () => ({
  db: {},
}));

const app = express();
app.use(express.json());
app.use('/api', router);

export { app };
