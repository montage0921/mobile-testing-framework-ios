/**
 * Day 2 TypeScript exercise. Run it with:  npx tsx scripts/day2-async.ts
 */
import { searchTerms, SearchTerm } from '../test/support/testData';

/** Wait `ms` milliseconds, then return `value`. */
async function waitAndReturn<T>(ms: number, value: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return value;
}

async function main(): Promise<void> {
  // import typed array
  searchTerms.forEach((term: SearchTerm) => console.log(`${term.query} -> expects "${term.expectedTitle}"`));

  // wait 1 second explicitly to see the actual search resultc 
  const withAwait = await waitAndReturn(1000, 'done');
  console.log('with await:', withAwait); // with await: done

  // Without await
  const withoutAwait = waitAndReturn(1000, 'done');
  console.log('without await:', withoutAwait); // without await: Promise { <pending> }
}

main();
