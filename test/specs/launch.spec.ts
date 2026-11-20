import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';

describe('App launch', () => {
  const home = new HomePage();

  before(async () => {
    await home.skipOnboarding();
  });

  it('shows the home screen after launch', async () => {
    expect(await home.isHomeDisplayed()).toBe(true);
  });
});
