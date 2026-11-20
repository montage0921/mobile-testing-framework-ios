/** A search to run in the app and the text the first result should contain. */
export interface SearchTerm {
  query: string;
  expectedTitle: string;
}

export const searchTerms: SearchTerm[] = [
  { query: 'Appium', expectedTitle: 'appium' },
  { query: 'Selenium', expectedTitle: 'selenium' },
  { query: 'TypeScript', expectedTitle: 'typescript' },
];

/** The search used by the smoke suite. */
export const smokeSearch: SearchTerm = searchTerms[0];

/** A query that matches no article. */
export const nonsenseQuery = 'zxqvbnmplk';

/** Text typed in the keyboard and app-state tests. */
export const typedQuery = 'Mobile testing';

/** How long the app stays in the background. */
export const backgroundSeconds = 3;

/** Words the location permission prompt must contain. */
export const locationPromptText = 'location';
