import { browser } from '@wdio/globals';
import { BasePage, PlatformLocator } from './BasePage';

/**
 * Home screen of the open-source Wikipedia app (the training app): first-launch onboarding,
 * the home screen, and the navigation that leads to the other screens.
 * Android locators confirmed in Appium Inspector against the dev build (org.wikipedia.dev, versionCode 50617).
 * iOS locators are the accessibility identifiers the app sets for its own UI tests
 * (wikimedia/wikipedia-ios, WMFComponents/.../AccessibilityIdentifiers.swift).
 *
 * Pattern to learn: tests call business-level methods (skipOnboarding, openSearch, openSettings).
 * Locators and low-level taps stay inside the page object.
 */
export class HomePage extends BasePage {
  // Onboarding shown on first launch. Android: "Forward" on pages 1-3, "Skip" on the last page.
  // iOS: "Next" until the personalization page, which has "Skip".
  private readonly onboardingForward: PlatformLocator = {
    android: '~Forward',
    ios: '~App Onboarding Next Button',
  };
  private readonly onboardingSkip: PlatformLocator = {
    android: 'android=new UiSelector().text("Skip")',
    ios: '~App Onboarding Skip Button',
  };
  // iOS: a Year in Review sheet can cover the tab bar right after launch.
  private readonly yearInReviewClose: PlatformLocator = { ios: '~Year in Review Close Button' };

  // Bottom navigation. The "Home" tab identifies the home screen.
  private readonly homeTab: PlatformLocator = { android: '~Home', ios: '~Root Tab Home Button' };
  private readonly searchTab: PlatformLocator = { android: '~Search', ios: '~Search Tab Button' };
  // Android: the "More" tab. iOS: the profile button in the top bar; both lead to Settings.
  private readonly moreTab: PlatformLocator = { android: '~More', ios: '~profile-button' };

  // On the Search tab: a one-time promo sheet (Android only) and the search box.
  private readonly promoClose: PlatformLocator = { android: '~Close' };
  private readonly searchEntry: PlatformLocator = { android: '~Search Wikipedia', ios: '~Search Field' };

  // Items in the "More" menu (Android) or the profile menu (iOS). On iOS Places is a bottom tab.
  private readonly settingsItem: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/main_drawer_settings_container")',
    ios: '~Profile Settings Row',
  };
  private readonly placesItem: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/main_drawer_places_container")',
    ios: '~Root Tab Places Button',
  };
  // iOS asks in its own alert before the system location prompt.
  private readonly enableLocation: PlatformLocator = { ios: '~Enable location' };

  async skipOnboarding(): Promise<void> {
    // The first page can take a while on a cold install (iOS migrates app data first).
    await this.isShown(this.onboardingForward, 30000);
    while (!(await this.tapIfShown(this.onboardingSkip, 1000)) && (await this.tapIfShown(this.onboardingForward))) {
      // keep paging forward until Skip appears
    }
    await this.tapIfShown(this.yearInReviewClose);
  }

  async isHomeDisplayed(): Promise<boolean> {
    return this.isShown(this.homeTab, 15000);
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

  /** Open Places (nearby articles). On first use the OS asks for the location permission. */
  async openPlaces(): Promise<void> {
    if (browser.isAndroid) await this.tap(this.moreTab);
    await this.tap(this.placesItem);
    await this.tapIfShown(this.enableLocation);
  }
}
