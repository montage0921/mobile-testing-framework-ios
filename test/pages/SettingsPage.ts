import { browser } from '@wdio/globals';
import { BasePage, PlatformLocator } from './BasePage';
import { scrollToTextSelector, swipeUpUntil } from '../support/gestures';

const ABOUT_TEXT = 'About the Wikipedia app';
const IOS_ABOUT_TEXT = 'About';

/** The Settings screen, opened with HomePage.openSettings(). A long list: "About" starts off screen. */
export class SettingsPage extends BasePage {
  // Android: back arrow. iOS: Settings is a modal sheet closed with "Done".
  private readonly navigateUp: PlatformLocator = {
    android: '~Navigate up',
    ios: '-ios predicate string:type == "XCUIElementTypeButton" AND label == "Done"',
  };

  // Settings rows share the resource id "title" (Android) and have no identifier (iOS), so the row text
  // is the stable locator.
  private readonly aboutItem: PlatformLocator = {
    android: `android=new UiSelector().text("${ABOUT_TEXT}")`,
    ios: `-ios predicate string:label == "${IOS_ABOUT_TEXT}"`,
  };

  // Same element, but finding it makes UiAutomator scroll the list until it is visible (Android only).
  private readonly aboutItemScrolled: PlatformLocator = { android: scrollToTextSelector(ABOUT_TEXT) };

  async isAboutVisible(): Promise<boolean> {
    return this.isShown(this.aboutItem, 1000);
  }

  /** Scroll with swipe gestures until "About" is visible. */
  async swipeToAbout(): Promise<boolean> {
    return swipeUpUntil(() => this.isAboutVisible());
  }

  /**
   * Scroll with the platform's scroll API until "About" is visible.
   * Android: a UiScrollable selector. iOS has no scroll-into-view selector, and the SwiftUI list only
   * creates rows near the screen, so XCUITest's `mobile: scroll` pages down until the row exists.
   */
  async scrollToAbout(): Promise<boolean> {
    if (browser.isAndroid) return this.isShown(this.aboutItemScrolled);
    for (let i = 0; i < 8 && !(await this.isAboutVisible()); i++) {
      await browser.execute('mobile: scroll', { direction: 'down' });
    }
    return this.isAboutVisible();
  }

  async close(): Promise<void> {
    await this.tap(this.navigateUp);
  }
}
