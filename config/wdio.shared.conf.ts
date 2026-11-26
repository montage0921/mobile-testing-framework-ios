import fs from 'node:fs';
import path from 'node:path';
import { browser } from '@wdio/globals';
import './env';

const screenshotDir = path.resolve(process.cwd(), 'reports', 'screenshots');

/**
 * Settings shared by every run (local Android, Perfecto Android, iOS Simulator).
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

  /**
   * Capture a screenshot and the page source (element tree XML) whenever a test fails, named after the test.
   * The XML holds every element's accessibility id, label and type: use it to write missing locators.
   */
  afterTest: async function (test, _context, { passed }) {
    if (passed) return;
    fs.mkdirSync(screenshotDir, { recursive: true });
    const safeName = test.title.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
    const base = path.join(screenshotDir, `${browser.isIOS ? 'ios' : 'android'}_${safeName}`);
    await browser.saveScreenshot(`${base}.png`);
    fs.writeFileSync(`${base}.xml`, await browser.getPageSource());
  },
};
