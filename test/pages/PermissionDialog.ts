import { BasePage, PlatformLocator } from './BasePage';

/**
 * Android's system permission prompt. It belongs to the OS (permission controller), not the app,
 * so the resource ids match any package.
 */
export class PermissionDialog extends BasePage {
  private readonly message: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/permission_message")',
  };
  private readonly allowWhileUsingApp: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/permission_allow_foreground_only_button")',
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
