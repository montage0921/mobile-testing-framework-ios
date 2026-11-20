import { BasePage, PlatformLocator } from './BasePage';

/** The search screen, opened with HomePage.openSearch(). */
export class SearchPage extends BasePage {
  // The query field. resourceIdMatches works for any build (alpha, dev).
  private readonly searchInput: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/search_src_text")',
  };

  // Title of the first result: first text inside the first tappable row. Rows have no ids or
  // accessibility ids; requiring a tappable row skips the empty-state message under the same parent.
  private readonly resultTitle: PlatformLocator = {
    android:
      'android=new UiSelector().resourceIdMatches(".*:id/fragment_search_results")' +
      '.childSelector(new UiSelector().clickable(true))' +
      '.childSelector(new UiSelector().className("android.widget.TextView"))',
  };

  // Shown when a query matches nothing. No id or accessibility id, so visible text.
  private readonly noResults: PlatformLocator = { android: 'android=new UiSelector().text("No results")' };

  // Shown while the query is empty.
  private readonly emptySearchMessage: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/search_empty_message")',
  };

  async search(term: string): Promise<void> {
    await this.enterText(this.searchInput, term);
  }

  /** Clear the query and press Enter. */
  async submitEmptySearch(): Promise<void> {
    const input = await this.find(this.searchInput);
    await input.waitForDisplayed();
    await input.clearValue();
    await this.pressEnter();
  }

  async currentQuery(): Promise<string> {
    return this.readText(this.searchInput);
  }

  async firstResultTitle(): Promise<string> {
    return this.readText(this.resultTitle);
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
