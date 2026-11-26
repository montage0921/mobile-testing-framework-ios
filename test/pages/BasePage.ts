import { $, browser } from '@wdio/globals';

/**
 * A locator per platform. Leave a platform out when the element only exists on the other one
 * (e.g. a one-time promo): tapIfShown skips it there, every other action fails with a clear error.
 *
 * Locator strategies (WebdriverIO selector syntax):
 *   Accessibility ID            '~Search Wikipedia'
 *   Android UiSelector          'android=new UiSelector().resourceId("pkg:id/name")'
 *   Android UiSelector (text)   'android=new UiSelector().text("Done")'
 *   iOS predicate string        '-ios predicate string:type == "XCUIElementTypeButton" AND label == "Done"'
 *   iOS class chain             '-ios class chain:**\/XCUIElementTypeSearchField'
 *
 * Prefer accessibility IDs (contentDescription on Android, accessibilityIdentifier or label on iOS):
 * they are stable and readable.
 */
export interface PlatformLocator {
  android?: string;
  ios?: string;
}

export abstract class BasePage {
  /** Pick the locator for the platform the current session is running on. */
  protected pick(locator: PlatformLocator): string {
    const platform = browser.isAndroid ? 'android' : 'ios';
    const value = locator[platform];
    if (!value) {
      throw new Error(`This locator has no ${platform} value. Add \`${platform}\` to the PlatformLocator.`);
    }
    return value;
  }

  /** Whether the locator has a value for the current platform. */
  protected has(locator: PlatformLocator): boolean {
    return !!locator[browser.isAndroid ? 'android' : 'ios'];
  }

  protected async find(locator: PlatformLocator) {
    return $(this.pick(locator));
  }

  protected async tap(locator: PlatformLocator): Promise<void> {
    const element = await this.find(locator);
    await element.waitForDisplayed();
    await element.click();
  }

  protected async enterText(locator: PlatformLocator, text: string): Promise<void> {
    const element = await this.find(locator);
    await element.waitForDisplayed();
    await element.setValue(text);
  }

  protected async readText(locator: PlatformLocator): Promise<string> {
    const element = await this.find(locator);
    await element.waitForDisplayed();
    return element.getText();
  }

  protected async isShown(locator: PlatformLocator, timeoutMs = 5000): Promise<boolean> {
    const element = await this.find(locator);
    return element.waitForDisplayed({ timeout: timeoutMs }).then(
      () => true,
      () => false,
    );
  }

  /**
   * Tap an element only if it appears, e.g. a one-time popup. Returns whether it was tapped.
   * An element with no locator for this platform never appears.
   */
  protected async tapIfShown(locator: PlatformLocator, timeoutMs = 3000): Promise<boolean> {
    if (!this.has(locator) || !(await this.isShown(locator, timeoutMs))) return false;
    await this.tap(locator);
    return true;
  }

  /** Press the Enter key on the keyboard while `locator` (a text field) has focus. */
  protected async pressEnter(locator: PlatformLocator): Promise<void> {
    if (browser.isAndroid) {
      await browser.pressKeyCode(66); // Android KEYCODE_ENTER
      return;
    }
    // iOS has no key codes: typing a newline into the field presses Return.
    await (await this.find(locator)).addValue('\n');
  }
}
