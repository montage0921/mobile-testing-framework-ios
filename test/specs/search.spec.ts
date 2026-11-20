import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { nonsenseQuery, searchTerms } from '../support/testData';

describe('Search', () => {
  const home = new HomePage();
  const search = new SearchPage();

  before(async () => {
    await home.skipOnboarding();
    await home.openSearch();
  });

  // Positive
  for (const term of searchTerms) {
    it(`shows a matching first result for "${term.query}"`, async () => {
      await search.search(term.query);
      expect((await search.firstResultTitle()).toLowerCase()).toContain(term.expectedTitle);
    });
  }

  // Negative
  it('shows "No results" for a nonsense query', async () => {
    await search.search(nonsenseQuery);
    expect(await search.isNoResultsShown()).toBe(true);
    expect(await search.hasResults()).toBe(false);
  });

  // Negative
  it('shows no results when an empty search is submitted', async () => {
    await search.submitEmptySearch();
    expect(await search.isEmptySearchMessageShown()).toBe(true);
    expect(await search.hasResults()).toBe(false);
  });
});
