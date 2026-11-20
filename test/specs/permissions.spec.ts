import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { PermissionDialog } from '../pages/PermissionDialog';
import { PlacesPage } from '../pages/PlacesPage';
import { locationPromptText } from '../support/testData';

/** Needs appium:autoGrantPermissions off (see config/wdio.android.local.conf.ts). */
describe('Permissions', () => {
  const home = new HomePage();
  const permission = new PermissionDialog();
  const places = new PlacesPage();

  before(async () => {
    await home.skipOnboarding();
  });

  it('asks for location when opening Places and shows the map once allowed', async () => {
    await home.openPlaces();

    expect(await permission.isDisplayed()).toBe(true);
    expect((await permission.messageText()).toLowerCase()).toContain(locationPromptText);

    await permission.allow();
    expect(await places.isMapDisplayed()).toBe(true);
  });
});
