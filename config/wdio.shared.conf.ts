import fs from 'node:fs';
import path from 'node:path';
import { browser } from '@wdio/globals';
import './env';

const screenshotDir = path.resolve(process.cwd(), 'reports', 'screenshots');

/**
 * Settings shared by every run (local Android, BrowserStack Android, BrowserStack iOS).
 * Each platform config spreads this object and adds its own capabilities and services.
 */
export const sharedConfig: Omit<WebdriverIO.Config, 'capabilities'> = {
  runner: 'local',
  specs: [path.resolve(process.cwd(), 'test', 'specs', '**', '*.spec.ts')],
  maxInstances: 1,
  logLevel: 'info',
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },

  /** Capture a screenshot whenever a test fails, named after the test. */
  afterTest: async function (test, _context, { passed }) {
    if (passed) return;
    fs.mkdirSync(screenshotDir, { recursive: true });
    const safeName = test.title.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
    const platform = browser.isIOS ? 'ios' : 'android';
    await browser.saveScreenshot(path.join(screenshotDir, `${platform}_${safeName}.png`));
  },
};
