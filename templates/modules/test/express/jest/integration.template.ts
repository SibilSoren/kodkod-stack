import request from 'supertest';
import { app } from '../setup';

describe('{{Name}} API', () => {
  describe('GET /{{kebabName}}', () => {
    it('should return a list', async () => {
      const res = await request(app).get('/{{kebabName}}');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /{{kebabName}}/:id', () => {
    it('should return 404 for non-existent item', async () => {
      const res = await request(app).get('/{{kebabName}}/non-existent');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /{{kebabName}}', () => {
    it('should handle creation request', async () => {
      const res = await request(app)
        .post('/{{kebabName}}')
        .send({
          // TODO: Add valid request body for {{name}}
        });
      expect([201, 400, 500]).toContain(res.status);
    });
  });

  describe('PUT /{{kebabName}}/:id', () => {
    it('should handle update request', async () => {
      const res = await request(app)
        .put('/{{kebabName}}/1')
        .send({
          // TODO: Add update data for {{name}}
        });
      expect([200, 404, 500]).toContain(res.status);
    });
  });

  describe('DELETE /{{kebabName}}/:id', () => {
    it('should handle delete request', async () => {
      const res = await request(app).delete('/{{kebabName}}/1');
      expect([204, 404, 500]).toContain(res.status);
    });
  });
});
