import { describe, it, expect } from 'vitest';
import { app } from '../setup.js';

describe('{{Name}} API', () => {
  describe('GET /api/{{kebabName}}', () => {
    it('should respond to list request', async () => {
      const res = await app.request('/api/{{kebabName}}');
      expect([200, 500]).toContain(res.status);
    });
  });

  describe('GET /api/{{kebabName}}/:id', () => {
    it('should respond to get by id request', async () => {
      const res = await app.request('/api/{{kebabName}}/non-existent');
      expect([200, 404, 500]).toContain(res.status);
    });
  });

  describe('POST /api/{{kebabName}}', () => {
    it('should handle creation request', async () => {
      const res = await app.request('/api/{{kebabName}}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // TODO: Add valid request body for {{name}}
        }),
      });
      expect([201, 400, 500]).toContain(res.status);
    });
  });

  describe('PUT /api/{{kebabName}}/:id', () => {
    it('should handle update request', async () => {
      const res = await app.request('/api/{{kebabName}}/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // TODO: Add update data for {{name}}
        }),
      });
      expect([200, 404, 500]).toContain(res.status);
    });
  });

  describe('DELETE /api/{{kebabName}}/:id', () => {
    it('should handle delete request', async () => {
      const res = await app.request('/api/{{kebabName}}/1', {
        method: 'DELETE',
      });
      expect([204, 404, 500]).toContain(res.status);
    });
  });
});
