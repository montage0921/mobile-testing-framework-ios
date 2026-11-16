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
  services: [['appium', { command: 'appium', args: { address: '127.0.0.1', port: 4723 } }]],
  port: 4723,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': optionalEnv('ANDROID_DEVICE_NAME', 'Android Emulator'),
      'appium:app': path.resolve(process.cwd(), optionalEnv('ANDROID_APP_PATH', 'apps/WikipediaSample.apk')),
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
      // When an AVD name is given, Appium starts that emulator if it is not running.
      ...(avd ? { 'appium:avd': avd } : {}),
    },
  ],
};
