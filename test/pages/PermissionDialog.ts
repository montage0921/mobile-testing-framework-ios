import { BasePage, PlatformLocator } from './BasePage';

/**
 * The system permission prompt. It belongs to the OS (Android permission controller, iOS system
 * alert), not the app, so these locators work for any app.
 */
export class PermissionDialog extends BasePage {
  private readonly message: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/permission_message")',
    // The alert title, e.g. Allow "Wikipedia" to use your location?
    ios: '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText',
  };
  private readonly allowWhileUsingApp: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/permission_allow_foreground_only_button")',
    ios: '~Allow While Using App',
  };

  async isDisplayed(): Promise<boolean> {
    return this.isShown(this.message);
  }

  async messageText(): Promise<string> {
    return this.readText(this.message);
  }

  async allow(): Promise<void> {
    await this.tap(this.allowWhileUsingApp);
  }
}
