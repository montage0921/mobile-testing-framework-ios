import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { smokeSearch } from '../support/testData';

/**
 * The same spec runs on both targets. It never mentions where it runs:
 * the config file decides that.
 *
 *   npm run test:local      Android emulator on your machine
 *   npm run test:perfecto   Perfecto cloud device
 *   npm run test:ios        iOS Simulator (macOS)
 */
describe('Smoke suite', () => {
  const home = new HomePage();
  const search = new SearchPage();

  before(async () => {
    await home.skipOnboarding();
  });

  it('launches on the home screen', async () => {
    expect(await home.isHomeDisplayed()).toBe(true);
  });

  it('shows a matching result after a search', async () => {
    await home.openSearch();
    await search.search(smokeSearch.query);
    expect((await search.firstResultTitle()).toLowerCase()).toContain(smokeSearch.expectedTitle);
  });
});
