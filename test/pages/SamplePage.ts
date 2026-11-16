import { BasePage, PlatformLocator } from './BasePage';

/**
 * Starter page object for the open-source Wikipedia Android app, used as the training app.
 * Locators confirmed against the dev build (org.wikipedia.dev, versionCode 50617).
 *
 * IMPORTANT (Day 3 exercise): these locators are starting points. Confirm each one in
 * Appium Inspector against the app version you actually installed, and correct any that
 * differ. When you move to your own application, replace this page object.
 *
 * Pattern to learn: tests call business-level methods (openSearch, search, firstResultTitle).
 * Locators and low-level taps stay inside the page object.
 */
export class SamplePage extends BasePage {
  // Onboarding shown on first launch: "Forward" on pages 1-3, "Skip" on the last page.
  private readonly onboardingForward: PlatformLocator = { android: '~Forward' };
  private readonly onboardingSkip: PlatformLocator = { android: 'android=new UiSelector().text("Skip")' };

  // Control that identifies the home screen (bottom navigation "Home" tab).
  private readonly home: PlatformLocator = {
    android: '~Home',
  };

  // Bottom navigation "Search" tab, its one-time promo sheet, and the search box on it.
  private readonly searchTab: PlatformLocator = { android: '~Search' };
  private readonly promoClose: PlatformLocator = { android: '~Close' };
  private readonly searchEntry: PlatformLocator = {
    android: '~Search Wikipedia',
  };

  // The text field on the search screen. resourceIdMatches works for any build (alpha, dev).
  private readonly searchInput: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/search_src_text")',
  };

  // The title of the first result in the list (result rows have no resource ids).
  private readonly resultTitle: PlatformLocator = {
    android:
      'android=new UiSelector().resourceIdMatches(".*:id/fragment_search_results")' +
      '.childSelector(new UiSelector().className("android.widget.TextView"))',
  };

  async skipOnboarding(): Promise<void> {
    while (await this.isShown(this.onboardingForward, 3000)) {
      await this.tap(this.onboardingForward);
    }
    if (await this.isShown(this.onboardingSkip, 3000)) {
      await this.tap(this.onboardingSkip);
    }
  }

  async isHomeDisplayed(): Promise<boolean> {
    return this.isShown(this.home);
  }

  async openSearch(): Promise<void> {
    await this.tap(this.searchTab);
    if (await this.isShown(this.promoClose, 3000)) {
      await this.tap(this.promoClose);
    }
    await this.tap(this.searchEntry);
  }

  async search(text: string): Promise<void> {
    await this.openSearch();
    await this.enterText(this.searchInput, text);
  }

  async firstResultTitle(): Promise<string> {
    return this.readText(this.resultTitle);
  }
}
