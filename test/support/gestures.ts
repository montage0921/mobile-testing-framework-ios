import { browser } from '@wdio/globals';

/**
 * Reusable mobile interactions: swipes, scrolling, keyboard, app state and rotation.
 * Android (UiAutomator2) implementations.
 */

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';
export type Orientation = 'PORTRAIT' | 'LANDSCAPE';

/**
 * Swipe across the middle of the screen with UiAutomator2's `mobile: swipeGesture`.
 * The direction is the finger's direction: 'up' moves the content up and reveals what is below.
 */
export async function swipe(direction: SwipeDirection, percent = 0.6): Promise<void> {
  const { width, height } = await browser.getWindowSize();
  await browser.execute('mobile: swipeGesture', {
    left: Math.round(width * 0.1),
    top: Math.round(height * 0.25),
    width: Math.round(width * 0.8),
    height: Math.round(height * 0.5),
    direction,
    percent,
  });
}

/** Swipe up until `isVisible` returns true. Returns false if it is still not visible after `maxSwipes`. */
export async function swipeUpUntil(isVisible: () => Promise<boolean>, maxSwipes = 8): Promise<boolean> {
  for (let i = 0; i < maxSwipes; i++) {
    if (await isVisible()) return true;
    await swipe('up');
  }
  return isVisible();
}

/**
 * Selector that makes UiAutomator scroll the first scrollable view until an element with this
 * exact text is on screen. Finding the element does the scrolling.
 */
export function scrollToTextSelector(text: string): string {
  return (
    'android=new UiScrollable(new UiSelector().scrollable(true))' +
    `.scrollIntoView(new UiSelector().text("${text}"))`
  );
}

export async function isKeyboardShown(): Promise<boolean> {
  return browser.isKeyboardShown();
}

export async function hideKeyboard(): Promise<void> {
  if (await browser.isKeyboardShown()) {
    await browser.hideKeyboard();
  }
}

/** Put the app in the background for `seconds`, then Android brings it back. */
export async function sendAppToBackground(seconds: number): Promise<void> {
  await browser.execute('mobile: backgroundApp', { seconds });
}

export async function rotate(orientation: Orientation): Promise<void> {
  await browser.setOrientation(orientation);
}

export async function currentOrientation(): Promise<Orientation> {
  return (await browser.getOrientation()).toUpperCase() as Orientation;
}
