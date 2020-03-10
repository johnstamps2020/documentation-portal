const searchController = require('../controllers/searchController');
const httpMocks = require('node-mocks-http');
const assert = require('assert');

const queryPhrase = 'billing';
describe(`Search for phrase ${queryPhrase}`, async () => {
  let results, request, response;

  before(async () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      query: {
        q: queryPhrase,
      },
    });
    response = httpMocks.createResponse();
    await searchController(request, response);
    results = response._getRenderData();
  });

  it('Should return more than 0 results', async () => {
    assert(results.totalNumOfResults > 0 && results.searchResults.length > 0);

    if (results.pages > 1) {
      describe('If the results contain more then one page', async () => {
          it('a request for the second page should return different results', async () => {
              request.query.page = 2;
              await searchController(request, response);
              const results2 = response._getRenderData();
              assert(results.searchResults[0] !== results2.searchResults[0]);
          });
      });
    }
  });

  it('Should return filters', () => {
    assert(results.filters.length > 0);
  });
  
});
