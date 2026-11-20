import { BasePage, PlatformLocator } from './BasePage';

/**
 * Home screen of the open-source Wikipedia Android app (the training app): first-launch
 * onboarding, the home screen, and the bottom navigation that leads to the other screens.
 * Locators confirmed in Appium Inspector against the dev build (org.wikipedia.dev, versionCode 50617).
 *
 * Pattern to learn: tests call business-level methods (skipOnboarding, openSearch, openSettings).
 * Locators and low-level taps stay inside the page object.
 */
export class HomePage extends BasePage {
  // Onboarding shown on first launch: "Forward" on pages 1-3, "Skip" on the last page.
  private readonly onboardingForward: PlatformLocator = { android: '~Forward' };
  private readonly onboardingSkip: PlatformLocator = { android: 'android=new UiSelector().text("Skip")' };

  // Bottom navigation. The "Home" tab identifies the home screen.
  private readonly homeTab: PlatformLocator = { android: '~Home' };
  private readonly searchTab: PlatformLocator = { android: '~Search' };
  private readonly moreTab: PlatformLocator = { android: '~More' };

  // On the Search tab: a one-time promo sheet and the search box.
  private readonly promoClose: PlatformLocator = { android: '~Close' };
  private readonly searchEntry: PlatformLocator = { android: '~Search Wikipedia' };

  // Items in the "More" menu.
  private readonly settingsItem: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/main_drawer_settings_container")',
  };
  private readonly placesItem: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/main_drawer_places_container")',
  };

  async skipOnboarding(): Promise<void> {
    while (await this.tapIfShown(this.onboardingForward)) {
      // keep paging forward
    }
    await this.tapIfShown(this.onboardingSkip);
  }

  async isHomeDisplayed(): Promise<boolean> {
    return this.isShown(this.homeTab);
  }

  /** Open the search screen, ready to type. */
  async openSearch(): Promise<void> {
    await this.tap(this.searchTab);
    await this.tapIfShown(this.promoClose);
    await this.tap(this.searchEntry);
  }

  async openSettings(): Promise<void> {
    await this.tap(this.moreTab);
    await this.tap(this.settingsItem);
  }

  /** Open Places (nearby articles). On first use Android asks for the location permission. */
  async openPlaces(): Promise<void> {
    await this.tap(this.moreTab);
    await this.tap(this.placesItem);
  }
}
