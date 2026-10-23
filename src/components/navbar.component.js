import BaseScreen from '../screens/base.screen.js';

class NavbarComponent extends BaseScreen {
  get cartButton() {
    return $(
      this.locator({
        android: '~cart badge',
        ios: '~tab bar option cart',
      }),
    );
  }

  get cartBadgeCount() {
    return $(
      this.locator({
        android:
          '//android.widget.TextView[@content-desc="cart badge"]/following-sibling::android.widget.TextView',
        ios: '//XCUIElementTypeOther[@name="tab bar option cart"]//XCUIElementTypeStaticText',
      }),
    );
  }

  get menuButton() {
    return $(
      this.locator({
        android: '//*[@content-desc="open menu" or @content-desc="view menu"]',
        ios: '~tab bar option menu',
      }),
    );
  }

  get catalogTab() {
    return $(
      this.locator({
        android: '~open menu',
        ios: '~tab bar option catalog',
      }),
    );
  }

  async openCart() {
    await this.click(this.cartButton, 'Cart Navigation Button');
  }

  async openMenu() {
    await this.click(this.menuButton, 'Menu Navigation Button');
  }

  async getCartCount() {
    if (await this.isDisplayed(this.cartBadgeCount)) {
      const count = await this.getText(this.cartBadgeCount, 'Cart Badge Count');
      return parseInt(count, 10) || 0;
    }
    return 0;
  }
}

export default new NavbarComponent();
