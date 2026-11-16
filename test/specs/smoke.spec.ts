import { expect } from '@wdio/globals';
import { SamplePage } from '../pages/SamplePage';

/**
 * The same spec runs on both targets. It never mentions where it runs:
 * the config file decides that.
 *
 *   npm run test:local      Android emulator on your machine
 *   npm run test:perfecto   Perfecto cloud device
 */
describe('Smoke suite', () => {
  const page = new SamplePage();

  it('launches on the home screen', async () => {
    expect(await page.isHomeDisplayed()).toBe(true);
  });

  it('shows a matching result after a search', async () => {
    await page.search('Appium');
    const title = await page.firstResultTitle();
    expect(title.toLowerCase()).toContain('appium');
  });
});
