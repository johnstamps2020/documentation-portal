const authGateway = require('../controllers/authController').authGateway;
const httpMocks = require('node-mocks-http');
const assert = require('assert');

describe('OKTA authentication', () => {
  const request = httpMocks.createRequest({
    method: 'GET',
    url: `${process.env.APP_BASE_URL}/some/route`,
    isAuthenticated: () => false,
    session: {},
  });
  const response = httpMocks.createResponse();

  it(`A request without authentication should return code 200`, () => {
    authGateway(request, response);
    assert.strictEqual(response.statusCode, 200);
  });
});
