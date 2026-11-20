import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { currentOrientation, rotate, sendAppToBackground } from '../support/gestures';
import { backgroundSeconds, smokeSearch, typedQuery } from '../support/testData';

describe('App state', () => {
  const home = new HomePage();
  const search = new SearchPage();

  before(async () => {
    await home.skipOnboarding();
  });

  after(async () => {
    await rotate('PORTRAIT');
  });

  it('keeps the screen state after going to the background', async () => {
    await home.openSearch();
    await search.search(typedQuery);

    await sendAppToBackground(backgroundSeconds);

    expect(await search.currentQuery()).toBe(typedQuery);
  });

  it('still works after rotating to landscape', async () => {
    await rotate('LANDSCAPE');
    expect(await currentOrientation()).toBe('LANDSCAPE');

    await search.search(smokeSearch.query);
    expect((await search.firstResultTitle()).toLowerCase()).toContain(smokeSearch.expectedTitle);
  });
});
