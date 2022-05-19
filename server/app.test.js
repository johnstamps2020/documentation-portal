const request = require('supertest');
const app = require('./app');
const { getVirtualDocument } = require('./lib/helpers');
const appRequest = request(app);

describe('The server app', () => {
  test('The root route responds to requests', async () => {
    const response = await appRequest.get('/');
    expect(response.statusCode).toBe(200);
  });

  test('Portal config redirects to unauthorized', async () => {
    const response = await appRequest.get('/portal-config/');
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

describe('Search', () => {
  test('An empty search returns no results', async () => {
    const response = await appRequest.get('/search');
    const htmlString = await response.text;
    const document = getVirtualDocument(htmlString);
    const h1 = document.querySelector('h1');
    const headerText = h1.innerHTML;
    expect(headerText).toContain(
      'Sorry, your search for "" returned no results.'
    );
  });
});
