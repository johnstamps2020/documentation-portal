const request = require('supertest');
const { app } = require('./test/helpers');

describe('The server app', () => {
  test('The root route responds to requests', async () => {
    setTimeout(() => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
    }, 5000)
  });

  test('Portal config redirects to unauthorized', async () => {
    const response = await request(app).get('/portal-config/');
    expect(response.statusCode).toBe(302);
    expect(response.text).toContain('/unauthorized');
  });

  test('If authentication is enabled, redirects to the login screen', async () => {
    process.env.ENABLE_AUTH = 'yes';
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(302);
    expect(response.text).toContain('Redirecting to /gw-login');
  });
});
