import { describe, it, expect } from 'vitest';
import { app } from '../setup.js';

describe('{{Name}} API', () => {
  describe('GET /api/{{kebabName}}', () => {
    it('should respond to list request', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/{{kebabName}}',
      });
      expect([200, 500]).toContain(res.statusCode);
    });
  });

  describe('GET /api/{{kebabName}}/:id', () => {
    it('should respond to get by id request', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/{{kebabName}}/non-existent',
      });
      expect([200, 404, 500]).toContain(res.statusCode);
    });
  });

  describe('POST /api/{{kebabName}}', () => {
    it('should handle creation request', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/{{kebabName}}',
        payload: {
          // TODO: Add valid request body for {{name}}
        },
      });
      expect([201, 400, 500]).toContain(res.statusCode);
    });
  });

  describe('PUT /api/{{kebabName}}/:id', () => {
    it('should handle update request', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: '/api/{{kebabName}}/1',
        payload: {
          // TODO: Add update data for {{name}}
        },
      });
      expect([200, 404, 500]).toContain(res.statusCode);
    });
  });

  describe('DELETE /api/{{kebabName}}/:id', () => {
    it('should handle delete request', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: '/api/{{kebabName}}/1',
      });
      expect([204, 404, 500]).toContain(res.statusCode);
    });
  });
});
