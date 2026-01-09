// Mock database before importing app
jest.mock('../src/db/index', () => ({
  db: {},
}));

// Export the app for tests
export { default as app } from '../src/index';
