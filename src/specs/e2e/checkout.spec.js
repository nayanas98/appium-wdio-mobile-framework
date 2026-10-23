import productsScreen from '../../screens/products.screen.js';
import cartScreen from '../../screens/cart.screen.js';
import navbarComponent from '../../components/navbar.component.js';
import { CHECKOUT_DATA } from '../../data/checkout.data.js';
import allureHelper, { SEVERITY } from '../../utils/allure.helper.js';

describe('E2E Suite - Product Purchase & Checkout Workflow', () => {
  beforeAll(async () => {
    allureHelper.setFeature('E-Commerce Purchasing');
    allureHelper.setSeverity(SEVERITY.CRITICAL);
  });

  it('should select a product, add to cart, and proceed to checkout', async () => {
    await allureHelper.step('Ensure products screen is active', async () => {
      await productsScreen.waitForIsShown();
    });

    await allureHelper.step(`Select product: ${CHECKOUT_DATA.PRODUCT.name}`, async () => {
      await productsScreen.selectProductByName(CHECKOUT_DATA.PRODUCT.name);
    });

    await allureHelper.step('Add product to cart', async () => {
      await productsScreen.addCurrentProductToCart();
    });

    await allureHelper.step('Verify cart counter increments to 1', async () => {
      const cartCount = await navbarComponent.getCartCount();
      expect(cartCount).toBe(1);
    });

    await allureHelper.step('Navigate to Cart screen', async () => {
      await navbarComponent.openCart();
      await cartScreen.waitForIsShown();
    });

    await allureHelper.step('Verify cart is not empty and proceed to checkout', async () => {
      const isEmpty = await cartScreen.isEmpty();
      expect(isEmpty).toBeFalse();

      await cartScreen.proceedToCheckout();
    });
  });
});
