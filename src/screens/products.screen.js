import BaseScreen from './base.screen.js';
import gestures from '../utils/gestures.js';

class ProductsScreen extends BaseScreen {
  constructor() {
    super('~products screen');
  }

  // --- Element Locators ---

  get screenHeader() {
    return $(
      this.locator({
        android: '//android.widget.TextView[@text="Products"]',
        ios: '//XCUIElementTypeStaticText[@name="Products"]',
      }),
    );
  }

  get productItems() {
    return $$(
      this.locator({
        android: '//android.view.ViewGroup[contains(@content-desc, "store item")]',
        ios: '//XCUIElementTypeOther[contains(@name, "store item")]',
      }),
    );
  }

  get sortButton() {
    return $(
      this.locator({
        android: '~sort button',
        ios: '~sort button',
      }),
    );
  }

  get addToCartButton() {
    return $(
      this.locator({
        android: '~Add To Cart button',
        ios: '~Add To Cart button',
      }),
    );
  }

  get productPrice() {
    return $(
      this.locator({
        android: '~product price',
        ios: '~product price',
      }),
    );
  }

  // --- Methods ---

  /**
   * Get title text to verify catalog screen is displayed
   */
  async getHeaderText() {
    return await this.getText(this.screenHeader, 'Products Screen Header');
  }

  /**
   * Select a specific product by its display title
   * @param {string} productName
   */
  async selectProductByName(productName) {
    const productSelector = this.locator({
      android: `//android.widget.TextView[@text="${productName}"]`,
      ios: `//XCUIElementTypeStaticText[@name="${productName}"]`,
    });

    const targetEl = await gestures.scrollUntilVisible(async () => $(productSelector));
    await this.click(targetEl, `Product: ${productName}`);
  }

  /**
   * Add currently opened product to cart
   */
  async addCurrentProductToCart() {
    const targetEl = await gestures.scrollUntilVisible(async () => this.addToCartButton);
    await this.click(targetEl, 'Add to Cart Button');
  }

  /**
   * Get count of product cards rendered on current viewport
   * @returns {Promise<number>}
   */
  async getLoadedProductsCount() {
    const items = await this.productItems;
    return items.length;
  }
}

export default new ProductsScreen();
