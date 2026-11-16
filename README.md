# Mobile Test Framework (Android emulator + Perfecto)

Starter framework for the Mobile Test Automation upskilling program.
One test suite runs on a **local Android emulator** and on **Perfecto cloud devices**.

**Stack:** TypeScript, Appium (UiAutomator2), WebdriverIO, Mocha, Page Object Model, Perfecto, Git.

## How it works

```
config/                              Where to run (one file per target)
  env.ts                             Reads .env, fails clearly when a value is missing
  wdio.shared.conf.ts                Settings shared by every run, screenshot on failure
  wdio.android.local.conf.ts         Android emulator + local Appium server
  wdio.android.perfecto.conf.ts      Perfecto cloud device
test/
  pages/BasePage.ts                  Shared actions + per-platform locator helper
  pages/SamplePage.ts                Example page object (replace with your app's screens)
  specs/smoke.spec.ts                Tests that call page methods only
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
2. `android=new UiSelector().resourceId("pkg:id/name")`
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
| Element not found | Re-inspect on the device that ran; the app version or screen may differ |

## Status of this starter

This project was written and syntax-checked but **not executed** against a live emulator or Perfecto
cloud. Confirm on first use:
- The `SamplePage.ts` locators (Day 3 exercise).
- The Perfecto capabilities in `config/wdio.android.perfecto.conf.ts`. If your Perfecto cloud
  expects different capability names or a different port or protocol, change them there.
