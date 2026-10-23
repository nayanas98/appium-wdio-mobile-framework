import BaseScreen from './base.screen.js';

class LoginScreen extends BaseScreen {
  constructor() {
    super('~Login screen');
  }

  // --- Element Locators (Cross-Platform) ---

  get usernameInput() {
    return $(
      this.locator({
        android: '~Username input field',
        ios: '~Username input field',
      }),
    );
  }

  get passwordInput() {
    return $(
      this.locator({
        android: '~Password input field',
        ios: '~Password input field',
      }),
    );
  }

  get loginButton() {
    return $(
      this.locator({
        android: '~Login button',
        ios: '~Login button',
      }),
    );
  }

  get errorMessage() {
    return $(
      this.locator({
        android:
          '//android.view.ViewGroup[@content-desc="generic-error-message"]//android.widget.TextView',
        ios: '//XCUIElementTypeStaticText[@name="generic-error-message"]',
      }),
    );
  }

  get usernameError() {
    return $(
      this.locator({
        android: '//android.widget.TextView[contains(@text, "Username is required")]',
        ios: '//XCUIElementTypeStaticText[contains(@name, "Username is required")]',
      }),
    );
  }

  get passwordError() {
    return $(
      this.locator({
        android: '//android.widget.TextView[contains(@text, "Password is required")]',
        ios: '//XCUIElementTypeStaticText[contains(@name, "Password is required")]',
      }),
    );
  }

  // --- Business Flow Methods ---

  /**
   * Complete login sequence with username and password
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    if (username !== undefined && username !== null) {
      await this.setValue(this.usernameInput, username, 'Username Input');
    }
    if (password !== undefined && password !== null) {
      await this.setValue(this.passwordInput, password, 'Password Input');
    }
    await this.click(this.loginButton, 'Login Button');
  }

  /**
   * Check if any error message is displayed on screen
   * @returns {Promise<boolean>}
   */
  async isErrorDisplayed() {
    return (
      (await this.isDisplayed(this.errorMessage)) ||
      (await this.isDisplayed(this.usernameError)) ||
      (await this.isDisplayed(this.passwordError))
    );
  }

  /**
   * Retrieve text of the error message displayed
   * @returns {Promise<string>}
   */
  async getErrorMessageText() {
    if (await this.isDisplayed(this.errorMessage)) {
      return await this.getText(this.errorMessage, 'Generic Error Message');
    }
    if (await this.isDisplayed(this.usernameError)) {
      return await this.getText(this.usernameError, 'Username Error');
    }
    if (await this.isDisplayed(this.passwordError)) {
      return await this.getText(this.passwordError, 'Password Error');
    }
    return '';
  }
}

export default new LoginScreen();
