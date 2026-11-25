import path from 'node:path';
import { optionalEnv, requireEnv } from './env';
import { sharedConfig } from './wdio.shared.conf';

/**
 * iOS Simulator + local Appium server. macOS only (needs Xcode).
 * Prerequisites: Xcode with an iOS Simulator runtime and the XCUITest driver (`npm run appium:driver:ios`).
 * In CI the same env vars (IOS_APP_PATH, IOS_UDID, ...) are set by the workflow.
 */
const udid = process.env.IOS_UDID;
const wdaDerivedData = process.env.IOS_WDA_DERIVED_DATA;

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  // Same port as the Android local config, so a manual `appium` (4723) for Appium Inspector does not clash.
  services: [['appium', { command: 'appium', args: { address: '127.0.0.1', port: 4724 } }]],
  port: 4724,

  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': optionalEnv('IOS_DEVICE_NAME', 'iPhone 17'),
      'appium:platformVersion': optionalEnv('IOS_PLATFORM_VERSION', '26.5'),
      // Simulator build of the app (a .app folder). Real devices need a signed .ipa instead.
      'appium:app': path.resolve(process.cwd(), requireEnv('IOS_APP_PATH')),
      // First WebDriverAgent build on a fresh machine is slow.
      'appium:wdaLaunchTimeout': 240_000,
      'appium:wdaConnectionTimeout': 240_000,
      'appium:wdaStartupRetries': 2,
      'appium:newCommandTimeout': 300,
      // Off so permissions.spec.ts can see and handle the real permission alert (same as Android).
      'appium:autoAcceptAlerts': false,
      'appium:printPageSourceOnFindFailure': true,
      // Set in CI; locally Appium picks the simulator by name and version.
      ...(udid ? { 'appium:udid': udid } : {}),
      // Reuse a WebDriverAgent built earlier to skip the build step.
      ...(wdaDerivedData ? { 'appium:usePrebuiltWDA': true, 'appium:derivedDataPath': wdaDerivedData } : {}),
    },
  ],
};
