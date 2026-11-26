import path from 'node:path';
import { optionalEnv, requireEnv } from './env';
import { sharedConfig } from './wdio.shared.conf';

/**
 * iOS Simulator + Appium. macOS only (needs Xcode).
 * Prerequisites: Xcode with an iOS Simulator runtime and the XCUITest driver (`npm run appium:driver:ios`).
 *
 * Locally: wdio starts its own Appium on port 4724.
 * In CI (GitHub Actions workflow ios-simulator-tests.yml): the workflow already runs Appium on 127.0.0.1:4723
 * and exports APPIUM_HOST/APPIUM_PORT, APP_PATH, UDID, DEVICE_NAME, PLATFORM_VERSION, WDA_DERIVED_DATA.
 * The IOS_* variables still win if set, so local .env setups keep working.
 */
const inCI = !!process.env.APPIUM_HOST;

const appPath = process.env.IOS_APP_PATH || process.env.APP_PATH || requireEnv('IOS_APP_PATH');
const udid = process.env.IOS_UDID || process.env.UDID;
const wdaDerivedData =
  process.env.IOS_WDA_DERIVED_DATA || (process.env.USE_PREBUILT_WDA ? process.env.WDA_DERIVED_DATA : undefined);

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  // CI: connect to the workflow's Appium (no second server; the project's local appium@2 does not match the
  // workflow's xcuitest driver). Local: start Appium on 4724 so a manual `appium` (4723) for Inspector does not clash.
  ...(inCI
    ? {
        services: [],
        hostname: process.env.APPIUM_HOST,
        port: Number(process.env.APPIUM_PORT ?? 4723),
      }
    : {
        services: [['appium', { command: 'appium', args: { address: '127.0.0.1', port: 4724 } }]],
        port: 4724,
      }),

  // First session on a CI runner (simulator setup + app install + WDA start) takes ~4-6 min.
  connectionRetryTimeout: inCI ? 1_500_000 : 300_000,
  connectionRetryCount: 1,

  mochaOpts: {
    ...(sharedConfig.mochaOpts ?? {}),
    timeout: inCI ? 1_800_000 : (sharedConfig.mochaOpts?.timeout ?? 120_000),
  },

  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': process.env.IOS_DEVICE_NAME || process.env.DEVICE_NAME || optionalEnv('IOS_DEVICE_NAME', 'iPhone 17'),
      'appium:platformVersion':
        process.env.IOS_PLATFORM_VERSION || process.env.PLATFORM_VERSION || optionalEnv('IOS_PLATFORM_VERSION', '26.5'),
      // Simulator build of the app (a .app folder). Real devices need a signed .ipa instead.
      'appium:app': path.resolve(process.cwd(), appPath),
      // First WebDriverAgent build on a fresh machine is slow.
      'appium:wdaLaunchTimeout': 240_000,
      'appium:wdaConnectionTimeout': 240_000,
      'appium:wdaStartupRetries': 2,
      // CI runners are slow; 300 s idle killed the session in an earlier run.
      'appium:newCommandTimeout': inCI ? 1800 : 300,
      // Off so permissions.spec.ts can see and handle the real permission alert (same as Android).
      'appium:autoAcceptAlerts': false,
      'appium:printPageSourceOnFindFailure': true,
      // Shows WDA's xcodebuild output in the Appium log when WDA fails to start.
      ...(inCI ? { 'appium:showXcodeLog': true } : {}),
      // Set in CI; locally Appium picks the simulator by name and version.
      ...(udid ? { 'appium:udid': udid } : {}),
      // Reuse a WebDriverAgent built earlier to skip the build step.
      ...(wdaDerivedData ? { 'appium:usePrebuiltWDA': true, 'appium:derivedDataPath': wdaDerivedData } : {}),
    },
  ],
};