import request from 'supertest';
import { app } from './test/helpers';

describe('The server app', () => {
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
