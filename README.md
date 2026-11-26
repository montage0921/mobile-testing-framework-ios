# Mobile Test Framework (Android emulator + Perfecto + iOS Simulator)

Starter framework for the Mobile Test Automation upskilling program.
One test suite runs on a **local Android emulator**, on **Perfecto cloud devices**, and on a **local iOS Simulator**.

**Stack:** TypeScript, Appium (UiAutomator2, XCUITest), WebdriverIO, Mocha, Page Object Model, Perfecto, Git.

## How it works

```
config/                              Where to run (one file per target)
  env.ts                             Reads .env, fails clearly when a value is missing
  wdio.shared.conf.ts                Settings shared by every run, screenshot on failure
  wdio.android.local.conf.ts         Android emulator + local Appium server
  wdio.android.perfecto.conf.ts      Perfecto cloud device
  wdio.ios.conf.ts                   iOS Simulator + local Appium server (macOS only)
test/
  pages/BasePage.ts                  Shared actions + per-platform locator helper
  pages/*.ts                         One page object per screen (Home, Search, Settings, Places,
                                     PermissionDialog)
  specs/*.spec.ts                    Tests that call page methods and helpers only
  support/testData.ts                Typed test data
  support/gestures.ts                Swipe, scroll, keyboard, background and rotation helpers
scripts/uploadApp.ts                 Uploads an .apk to the Perfecto repository
apps/                                Your app files (git-ignored)
```

The key idea: **tests never mention where they run.** Page objects own the locators, and the
config file decides the target. Moving from the emulator to Perfecto changes one command, not the tests.

## Prerequisites

| Need | For |
| --- | --- |
| Node.js 18+, Git, Visual Studio Code | everything |
| Android Studio with an Android Virtual Device (AVD) and `ANDROID_HOME` set | local emulator runs |
| A Perfecto cloud name and security token | Perfecto runs |
| A Mac with Xcode and an iOS Simulator runtime | iOS runs |

## Setup

```bash
npm install
cp .env.example .env          # Windows: copy .env.example .env
npm run typecheck             # should finish with no errors
```

### Run on the local Android emulator

```bash
npm run appium:driver         # one time: installs the UiAutomator2 driver
# start your emulator (or set ANDROID_AVD in .env). Put the .apk in apps/
npm run test:local
```

### Run on the iOS Simulator (macOS only)

```bash
npm run appium:driver:ios     # one time: installs the XCUITest driver
# put the simulator build (Wikipedia.app) in apps/ and set IOS_* in .env
npm run test:ios
```

The first run builds WebDriverAgent and can take several minutes.
The iOS locators are the accessibility identifiers the Wikipedia iOS app sets for its own UI tests
(`WMFComponents/.../AccessibilityIdentifiers.swift` in wikimedia/wikipedia-ios). If an iOS build
renames one, the failed test's `reports/screenshots/ios_*.xml` shows the current element tree.

### Run on Perfecto

1. In `.env` set `PERFECTO_CLOUD_NAME` and `PERFECTO_SECURITY_TOKEN`
   (Perfecto UI > profile menu > My Profile > Security Token).
2. Upload the app and note the repository key it prints:

   ```bash
   npm run upload -- apps/WikipediaSample.apk
   ```

3. Set `PERFECTO_ANDROID_APP` to that key (for example `PRIVATE:WikipediaSample.apk`).
4. Optionally set `PERFECTO_DEVICE_NAME` to a regular expression such as `Pixel.*`.
5. Run:

   ```bash
   npm run test:perfecto
   ```

Open the Perfecto **Report Library** to see video, logs and screenshots for the run.

## Adding a screen and a test

1. Inspect the screen with Appium Inspector and note the locators.
2. Create a page object extending `BasePage`:

```ts
import { BasePage, PlatformLocator } from './BasePage';

export class LoginPage extends BasePage {
  private readonly username: PlatformLocator = { android: '~username' };
  private readonly submit: PlatformLocator = { android: '~login' };

  async login(user: string): Promise<void> {
    await this.enterText(this.username, user);
    await this.tap(this.submit);
  }
}
```

3. Write a spec in `test/specs/` that calls page methods only.
4. Run it on the emulator first, then on Perfecto.

## Locator priority

1. Accessibility ID (`~name`). Ask developers to add `contentDescription` values.
2. Android: `android=new UiSelector().resourceId("pkg:id/name")`. iOS: `-ios predicate string:...` or `-ios class chain:...`
3. Visible text, if stable
4. XPath, as a last resort (slow and brittle)

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `Missing environment variable ...` | `.env` missing or not filled in |
| Local run cannot connect | Emulator not running, driver not installed, port 4723 in use |
| Perfecto 401 or authentication error | Wrong cloud name or security token |
| Perfecto cannot find the app | Repository key in `.env` does not match what the upload printed |
| Perfecto cannot allocate a device | `PERFECTO_DEVICE_NAME` regex matches no available device; widen it to `.*` |
| iOS run hangs or fails at session start | WebDriverAgent build failed: open Xcode once, accept the license, check `IOS_DEVICE_NAME` / `IOS_PLATFORM_VERSION` match `xcrun simctl list devices` |
| `This locator has no iOS value` | Add the `ios` locator to that page object |
| Element not found | Re-inspect on the device that ran; the app version or screen may differ |

## Status of this starter

This project was written and syntax-checked but **not executed** against a live emulator or Perfecto
cloud. Confirm on first use:
- The page object locators (Day 3 exercise).
- The Perfecto capabilities in `config/wdio.android.perfecto.conf.ts`. If your Perfecto cloud
  expects different capability names or a different port or protocol, change them there.
