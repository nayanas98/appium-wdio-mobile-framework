import BaseScreen from './base.screen.js';

class CartScreen extends BaseScreen {
  constructor() {
    super('~cart screen');
  }

  get emptyCartMessage() {
    return $(
      this.locator({
        android: '//android.widget.TextView[@text="No Items"]',
        ios: '//XCUIElementTypeStaticText[@name="No Items"]',
      }),
    );
  }

  get proceedToCheckoutButton() {
    return $(
      this.locator({
        android: '~Proceed To Checkout button',
        ios: '~Proceed To Checkout button',
      }),
    );
  }

  get totalAmount() {
    return $(
      this.locator({
        android: '~total amount',
        ios: '~total amount',
      }),
    );
  }

  get cartItems() {
    return $$(
      this.locator({
        android: '//android.view.ViewGroup[contains(@content-desc, "product row")]',
        ios: '//XCUIElementTypeOther[contains(@name, "product row")]',
      }),
    );
  }

  async proceedToCheckout() {
    await this.click(this.proceedToCheckoutButton, 'Proceed to Checkout Button');
  }

  async getTotalPrice() {
    return await this.getText(this.totalAmount, 'Cart Total Price');
  }

  async isEmpty() {
    return await this.isDisplayed(this.emptyCartMessage);
  }
}

export default new CartScreen();
