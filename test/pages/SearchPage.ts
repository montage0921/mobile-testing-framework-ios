import { browser } from '@wdio/globals';
import { BasePage, PlatformLocator } from './BasePage';

const IOS_RESULT_PREFIX = 'Search Result ';

/** The search screen, opened with HomePage.openSearch(). */
export class SearchPage extends BasePage {
  // The query field. resourceIdMatches works for any build (alpha, dev).
  private readonly searchInput: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/search_src_text")',
    ios: '~Search Field',
  };

  // Android: title of the first result, the first text inside the first tappable row. Rows have no ids or
  // accessibility ids; requiring a tappable row skips the empty-state message under the same parent.
  // iOS: the first result row; its accessibility identifier is "Search Result <title>".
  private readonly resultTitle: PlatformLocator = {
    android:
      'android=new UiSelector().resourceIdMatches(".*:id/fragment_search_results")' +
      '.childSelector(new UiSelector().clickable(true))' +
      '.childSelector(new UiSelector().className("android.widget.TextView"))',
    ios: `-ios predicate string:name BEGINSWITH "${IOS_RESULT_PREFIX}"`,
  };

  // Shown when a query matches nothing. No id or accessibility id, so visible text.
  private readonly noResults: PlatformLocator = {
    android: 'android=new UiSelector().text("No results")',
    ios: '~No results found',
  };

  // Shown while the query is empty. iOS shows the recent searches list (or "No recent searches yet").
  private readonly emptySearchMessage: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/search_empty_message")',
    ios: '~Search Recent Searches View',
  };

  async search(term: string): Promise<void> {
    await this.enterText(this.searchInput, term);
  }

  /** Clear the query and press Enter. */
  async submitEmptySearch(): Promise<void> {
    const input = await this.find(this.searchInput);
    await input.waitForDisplayed();
    await input.clearValue();
    await this.pressEnter(this.searchInput);
  }

  async currentQuery(): Promise<string> {
    return this.readText(this.searchInput);
  }

  async firstResultTitle(): Promise<string> {
    if (browser.isAndroid) return this.readText(this.resultTitle);
    const row = await this.find(this.resultTitle);
    await row.waitForDisplayed();
    return ((await row.getAttribute('name')) ?? '').slice(IOS_RESULT_PREFIX.length);
  }

  async hasResults(): Promise<boolean> {
    return this.isShown(this.resultTitle, 3000);
  }

  async isNoResultsShown(): Promise<boolean> {
    return this.isShown(this.noResults);
  }

  async isEmptySearchMessageShown(): Promise<boolean> {
    return this.isShown(this.emptySearchMessage);
  }
}
