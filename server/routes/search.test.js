const { querySelectorFromEndpoint } = require('../test/helpers');

describe('Search', () => {
  test('An empty search returns no results', async () => {
    const h1 = await querySelectorFromEndpoint('/search', 'h1');
    const headerText = h1.innerHTML;
    expect(headerText).toContain(
      'Sorry, your search for "" returned no results.'
    );
  });

  test('A search for a specific phrase returns some results', async () => {
    const searchPhrase = 'API';
    const h1 = await querySelectorFromEndpoint(
      `/search?q=${searchPhrase}`,
      'h1'
    );
    const headerText = h1.innerHTML;
    expect(headerText).toContain(`Search results for "${searchPhrase}"`);
  });
});
