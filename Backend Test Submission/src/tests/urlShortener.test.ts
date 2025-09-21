import request from 'supertest';
import express from 'express';
import urlShortenerRoutes from '../routes/urlShortenerRoutes';

const app = express();
app.use(express.json());
app.use('/api', urlShortenerRoutes);

describe('URL Shortener API', () => {
  describe('POST /api/shorturls', () => {
    it('should create a short URL with valid data', async () => {
      const response = await request(app)
        .post('/api/shorturls')
        .send({
          url: 'https://www.google.com',
          validity: 60,
          shortcode: 'test123',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('shortLink');
      expect(response.body.data).toHaveProperty('expiry');
    });

    it('should reject invalid URL', async () => {
      const response = await request(app)
        .post('/api/shorturls')
        .send({
          url: 'invalid-url',
          validity: 30,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate shortcode', async () => {
      // First request
      await request(app)
        .post('/api/shorturls')
        .send({
          url: 'https://www.example.com',
          shortcode: 'duplicate',
        });

      // Second request with same shortcode
      const response = await request(app)
        .post('/api/shorturls')
        .send({
          url: 'https://www.google.com',
          shortcode: 'duplicate',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/shorturls/:shortcode', () => {
    it('should return statistics for existing shortcode', async () => {
      // First create a short URL
      const createResponse = await request(app)
        .post('/api/shorturls')
        .send({
          url: 'https://www.google.com',
          shortcode: 'stats123',
        });

      expect(createResponse.status).toBe(201);

      // Then get statistics
      const response = await request(app).get('/api/shorturls/stats123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('clicks');
      expect(response.body.data).toHaveProperty('originalURL');
      expect(response.body.data).toHaveProperty('creationDate');
      expect(response.body.data).toHaveProperty('expiry');
      expect(response.body.data).toHaveProperty('clicksDetail');
    });

    it('should return 404 for non-existent shortcode', async () => {
      const response = await request(app).get('/api/shorturls/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('healthy');
    });
  });
});
