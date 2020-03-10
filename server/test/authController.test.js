const authGateway = require('../controllers/authController').authGateway;
const httpMocks = require('node-mocks-http');
const assert = require('assert');
const sinon = require('sinon');

describe('OKTA authentication', () => {
  const loginGatewayRoute = require('../controllers/authController').loginGatewayRoute;
  const request = httpMocks.createRequest({
    method: 'GET',
    url: '/',
    isAuthenticated: () => false,
  });
  const response = httpMocks.createResponse();

  it(`A request without authentication should return the redirect code (302)`, () => {
    authGateway(request, response);
    assert.equal(response.statusCode, 302);
  });

  it(`A request without authentication should redirect to ${loginGatewayRoute}`, () => {
    authGateway(request, response);
    assert.equal(response._getRedirectUrl(), loginGatewayRoute);
  });

  it('A request with authentication should call the next() route', () => {
    request.isAuthenticated = () => true;
    const spy = sinon.spy();
    authGateway(request, response, spy);
    assert.equal(spy.called, true);
  });
});
