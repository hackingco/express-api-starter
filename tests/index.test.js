const request = require('supertest');
const app = require('../src/index');

describe('test-swarm-project-1752223830056 API Tests', () => {
  test('GET /health should return healthy status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });

  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('test-swarm-project-1752223830056');
  });

  test('POST /echo should echo the request body', async () => {
    const testData = { test: 'data' };
    const response = await request(app)
      .post('/echo')
      .send(testData);
    expect(response.status).toBe(200);
    expect(response.body.echo).toEqual(testData);
  });
});
