import { BasePage, PlatformLocator } from './BasePage';

/**
 * Starter page object for the open-source Wikipedia Android app (alpha build,
 * package org.wikipedia.alpha), used as the training app.
 *
 * IMPORTANT (Day 3 exercise): these locators are starting points. Confirm each one in
 * Appium Inspector against the app version you actually installed, and correct any that
 * differ. When you move to your own application, replace this page object.
 *
 * Pattern to learn: tests call business-level methods (openSearch, search, firstResultTitle).
 * Locators and low-level taps stay inside the page object.
 */
export class SamplePage extends BasePage {
  // Control that identifies the home screen.
  private readonly home: PlatformLocator = {
    android: '~Search Wikipedia',
  };

  // The search box on the home screen.
  private readonly searchEntry: PlatformLocator = {
    android: '~Search Wikipedia',
  };

  // The text field on the search screen.
  private readonly searchInput: PlatformLocator = {
    android: 'android=new UiSelector().resourceId("org.wikipedia.alpha:id/search_src_text")',
  };

  // The title of a result in the list.
  private readonly resultTitle: PlatformLocator = {
    android: 'android=new UiSelector().resourceId("org.wikipedia.alpha:id/page_list_item_title")',
  };

  async isHomeDisplayed(): Promise<boolean> {
    return this.isShown(this.home);
  }

  async openSearch(): Promise<void> {
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
