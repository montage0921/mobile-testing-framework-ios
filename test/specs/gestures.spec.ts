import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { SettingsPage } from '../pages/SettingsPage';
import { hideKeyboard, isKeyboardShown } from '../support/gestures';
import { typedQuery } from '../support/testData';

describe('Gestures and keyboard', () => {
  const home = new HomePage();
  const search = new SearchPage();
  const settings = new SettingsPage();

  before(async () => {
    await home.skipOnboarding();
  });

  it('swipes to an element that starts off screen', async () => {
    await home.openSettings();
    expect(await settings.isAboutVisible()).toBe(false);
    expect(await settings.swipeToAbout()).toBe(true);
    await settings.close();
  });

  it('scrolls to an element with the scroll API (UiScrollable, mobile: scroll)', async () => {
    await home.openSettings();
    expect(await settings.isAboutVisible()).toBe(false);
    expect(await settings.scrollToAbout()).toBe(true);
    await settings.close();
  });

  it('enters text and dismisses the keyboard', async () => {
    await home.openSearch();
    await search.search(typedQuery);
    expect(await isKeyboardShown()).toBe(true);

    await hideKeyboard();
    expect(await isKeyboardShown()).toBe(false);
    expect(await search.currentQuery()).toBe(typedQuery);
  });
});
