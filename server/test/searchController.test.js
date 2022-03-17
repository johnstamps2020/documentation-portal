console.log('Elastic node setting:', process.env.ELASTIC_SEARCH_URL);
const searchController = require('../controllers/searchController');
const httpMocks = require('node-mocks-http');
const assert = require('assert');
const mockUserData = require('../controllers/utils/mockUserData');

const queryPhrase = 'configuring merge tracker';
describe(`Search for phrase ${queryPhrase}`, async function() {
  this.timeout(8000);
  let results, request, response;

  before(async () => {
    try {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/',
        query: {
          q: queryPhrase,
        },
        session: { requestIsAuthenticated: () => true },
      });
      response = httpMocks.createResponse({
        locals: { userInfo: () => mockUserData.internal },
      });
      await searchController(request, response);
      results = response._getRenderData();
    } catch (err) {
      console.log(err);
    }
  });

  async function getResultsFromSecondPage() {
    request.query.page = 2;
    await searchController(request, response);
    const results = response._getRenderData();
    return results;
  }

  it('Should return more than 0 results', async () => {
    assert(results.totalNumOfResults > 0 && results.searchResults.length > 0);

    if (results.pages > 1) {
      const resultsFromSecondPage = await getResultsFromSecondPage();
      describe('If the results contain more then one page', async () => {
        it('a request for the second page should return different results', async () => {
          assert(
            results.searchResults[0] !== resultsFromSecondPage.searchResults[0]
          );
        });
      });
    }
  });

  it('Should return filters', () => {
    assert(results.filters.length > 0);
  });
});
