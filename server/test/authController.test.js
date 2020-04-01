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
    const nextSpy = sinon.spy();
    authGateway(request, response, nextSpy);
    assert(!nextSpy.called);
    assert.equal(response._getRedirectUrl(), targetRoute);
  });
});
