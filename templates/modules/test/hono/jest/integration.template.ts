import { app } from '../setup';

describe('{{Name}} API', () => {
  describe('GET /{{kebabName}}', () => {
    it('should return a list', async () => {
      const res = await app.request('/{{kebabName}}');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /{{kebabName}}/:id', () => {
    it('should return 404 for non-existent item', async () => {
      const res = await app.request('/{{kebabName}}/non-existent');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /{{kebabName}}', () => {
    it('should handle creation request', async () => {
      const res = await app.request('/{{kebabName}}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // TODO: Add valid request body for {{name}}
        }),
      });
      expect([201, 400, 500]).toContain(res.status);
    });
  });

  describe('PUT /{{kebabName}}/:id', () => {
    it('should handle update request', async () => {
      const res = await app.request('/{{kebabName}}/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // TODO: Add update data for {{name}}
        }),
      });
      expect([200, 404, 500]).toContain(res.status);
    });
  });

  describe('DELETE /{{kebabName}}/:id', () => {
    it('should handle delete request', async () => {
      const res = await app.request('/{{kebabName}}/1', {
        method: 'DELETE',
      });
      expect([204, 404, 500]).toContain(res.status);
    });
  });
});
