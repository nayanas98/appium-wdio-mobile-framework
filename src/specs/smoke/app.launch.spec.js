import productsScreen from '../../screens/products.screen.js';
import navbarComponent from '../../components/navbar.component.js';
import allureHelper, { SEVERITY } from '../../utils/allure.helper.js';

describe('Smoke Suite - Mobile Application Health & Launch', () => {
  beforeAll(async () => {
    allureHelper.setFeature('Application Launch');
    allureHelper.setSeverity(SEVERITY.BLOCKER);
  });

  it('should launch the mobile application and render the catalog screen', async () => {
    await allureHelper.step('Wait for Products screen to load', async () => {
      const isHeaderVisible = await productsScreen.isDisplayed(productsScreen.screenHeader);
      expect(isHeaderVisible).toBeTrue();
    });

    await allureHelper.step('Verify header title text', async () => {
      const headerText = await productsScreen.getHeaderText();
      expect(headerText).toBe('Products');
    });

    await allureHelper.step('Verify products are populated on screen', async () => {
      const productCount = await productsScreen.getLoadedProductsCount();
      expect(productCount).toBeGreaterThan(0);
    });

    await allureHelper.step('Verify navigation menu and cart buttons are rendered', async () => {
      const isMenuVisible = await navbarComponent.isDisplayed(navbarComponent.menuButton);
      const isCartVisible = await navbarComponent.isDisplayed(navbarComponent.cartButton);

      expect(isMenuVisible).toBeTrue();
      expect(isCartVisible).toBeTrue();
    });
  });
});
