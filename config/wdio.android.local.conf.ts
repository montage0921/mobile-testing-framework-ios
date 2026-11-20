import path from 'node:path';
import { optionalEnv } from './env';
import { sharedConfig } from './wdio.shared.conf';

/**
 * Android on your own machine: Android Emulator + local Appium server.
 * Prerequisites: Node.js, Android Studio with an AVD, ANDROID_HOME set,
 * and the UiAutomator2 driver (`npm run appium:driver`).
 */
const avd = process.env.ANDROID_AVD;

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  // The Appium service starts and stops the local Appium server for the run.
  // Port 4724 so it does not clash with a manual `appium` (4723) used by Appium Inspector.
  services: [['appium', { command: 'appium', args: { address: '127.0.0.1', port: 4724 } }]],
  port: 4724,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': optionalEnv('ANDROID_DEVICE_NAME', 'Android Emulator'),
      'appium:app': path.resolve(process.cwd(), optionalEnv('ANDROID_APP_PATH', 'apps/WikipediaSample.apk')),
      // First launch opens the onboarding screen, not MainActivity.
      'appium:appWaitActivity': 'org.wikipedia.*',
      // Off so permissions.spec.ts can see and handle the real permission prompt.
      'appium:autoGrantPermissions': false,
      'appium:newCommandTimeout': 240,
      // When an AVD name is given, Appium starts that emulator if it is not running.
      ...(avd ? { 'appium:avd': avd } : {}),
    },
  ],
};
