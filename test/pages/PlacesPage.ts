import { BasePage, PlatformLocator } from './BasePage';

/** Places: a map of articles near the device location, opened with HomePage.openPlaces(). */
export class PlacesPage extends BasePage {
  private readonly map: PlatformLocator = {
    android: 'android=new UiSelector().resourceIdMatches(".*:id/mapView")',
  };

  async isMapDisplayed(): Promise<boolean> {
    return this.isShown(this.map, 10000);
  }
}
