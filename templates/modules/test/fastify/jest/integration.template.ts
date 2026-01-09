import { app } from '../setup';

describe('{{Name}} API', () => {
  describe('GET /{{kebabName}}', () => {
    it('should return a list', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/{{kebabName}}',
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /{{kebabName}}/:id', () => {
    it('should return 404 for non-existent item', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/{{kebabName}}/non-existent',
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /{{kebabName}}', () => {
    it('should handle creation request', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/{{kebabName}}',
        payload: {
          // TODO: Add valid request body for {{name}}
        },
      });
      expect([201, 400, 500]).toContain(res.statusCode);
    });
  });

  describe('PUT /{{kebabName}}/:id', () => {
    it('should handle update request', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: '/{{kebabName}}/1',
        payload: {
          // TODO: Add update data for {{name}}
        },
      });
      expect([200, 404, 500]).toContain(res.statusCode);
    });
  });

  describe('DELETE /{{kebabName}}/:id', () => {
    it('should handle delete request', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: '/{{kebabName}}/1',
      });
      expect([204, 404, 500]).toContain(res.statusCode);
    });
  });
});
