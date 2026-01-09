import { vi } from 'vitest';

// Mock database before importing app
vi.mock('../src/db/index.js', () => ({
  db: {},
}));

// Export the app for tests
export { default as app } from '../src/index.js';
