const unitUnderTest = require('../controllers/authController').authGateway;
const httpMocks = require('node-mocks-http');
const assert = require('assert');

describe('OKTA authentication', () => {
  it('A request without authentication should redirect (302)', () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      isAuthenticated: () => false,
    });
    const response = httpMocks.createResponse();
    unitUnderTest(request, response);
    assert.equal(response.statusCode, 302);
  });
});
