import { optionalEnv, requireEnv } from './env';
import { sharedConfig } from './wdio.shared.conf';

/**
 * Android on a Perfecto cloud device.
 *
 * Before the first run:
 *   1. Put your cloud name and security token in .env
 *   2. Upload the app:  npm run upload -- apps/WikipediaSample.apk
 *   3. Set PERFECTO_ANDROID_APP to the repository key that the upload prints
 *
 * All Perfecto-specific settings live in this one file. If Perfecto's capability
 * requirements change, this is the only place to edit.
 */
// WebdriverIO's types don't know Perfecto's vendor capability; declare it.
declare global {
  namespace WebdriverIO {
    interface Capabilities {
      'perfecto:securityToken'?: string;
    }
  }
}

const cloud = requireEnv('PERFECTO_CLOUD_NAME');
const platformVersion = process.env.PERFECTO_PLATFORM_VERSION;

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  // Perfecto's Appium endpoint. No local Appium service is needed for cloud runs.
  protocol: optionalEnv('PERFECTO_PROTOCOL', 'https') as 'http' | 'https',
  hostname: `${cloud}.perfectomobile.com`,
  port: Number(optionalEnv('PERFECTO_PORT', '443')),
  path: '/nexperience/perfectomobile/wd/hub',

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      // A regular expression that Perfecto matches against available devices.
      'appium:deviceName': optionalEnv('PERFECTO_DEVICE_NAME', '.*'),
      ...(platformVersion ? { 'appium:platformVersion': platformVersion } : {}),
      // The app already uploaded to the Perfecto repository, e.g. PRIVATE:WikipediaSample.apk
      'appium:app': requireEnv('PERFECTO_ANDROID_APP'),
      'perfecto:securityToken': requireEnv('PERFECTO_SECURITY_TOKEN'),
    },
  ],
};
