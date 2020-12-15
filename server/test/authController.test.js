const authGateway = require('../controllers/authController').authGateway;
const httpMocks = require('node-mocks-http');
const assert = require('assert');
const sinon = require('sinon');

describe('OKTA authentication', () => {
  const targetRoute = '/some/route';
  const loginGatewayRoute = require('../controllers/authController')
    .loginGatewayRoute;
  const request = httpMocks.createRequest({
    method: 'GET',
    url: targetRoute,
    isAuthenticated: () => false,
    session: {},
  });
  const response = httpMocks.createResponse();

  it(`A request without authentication should return code 200`, () => {
    authGateway(request, response);
    assert.strictEqual(response.statusCode, 200);
  });
});
