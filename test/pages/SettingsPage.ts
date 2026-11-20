import { BasePage, PlatformLocator } from './BasePage';
import { scrollToTextSelector, swipeUpUntil } from '../support/gestures';

const ABOUT_TEXT = 'About the Wikipedia app';

/** The Settings screen, opened with HomePage.openSettings(). A long list: "About" starts off screen. */
export class SettingsPage extends BasePage {
  private readonly navigateUp: PlatformLocator = { android: '~Navigate up' };

  // Settings rows share the resource id "title", so the row text is the stable locator.
  private readonly aboutItem: PlatformLocator = { android: `android=new UiSelector().text("${ABOUT_TEXT}")` };

  // Same element, but finding it makes UiAutomator scroll the list until it is visible.
  private readonly aboutItemScrolled: PlatformLocator = { android: scrollToTextSelector(ABOUT_TEXT) };

  async isAboutVisible(): Promise<boolean> {
    return this.isShown(this.aboutItem, 1000);
  }

  /** Scroll with swipe gestures until "About the Wikipedia app" is visible. */
  async swipeToAbout(): Promise<boolean> {
    return swipeUpUntil(() => this.isAboutVisible());
  }

  /** Scroll with a UiScrollable selector until "About the Wikipedia app" is visible. */
  async scrollToAbout(): Promise<boolean> {
    return this.isShown(this.aboutItemScrolled);
  }

  async close(): Promise<void> {
    await this.tap(this.navigateUp);
  }
}
