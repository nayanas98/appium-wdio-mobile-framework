import BaseScreen from '../screens/base.screen.js';

class DialogComponent extends BaseScreen {
  get alertContainer() {
    return $(
      this.locator({
        android: 'id:android:id/parentPanel',
        ios: '//XCUIElementTypeAlert',
      }),
    );
  }

  get alertTitle() {
    return $(
      this.locator({
        android: 'id:android:id/alertTitle',
        ios: '//XCUIElementTypeAlert//XCUIElementTypeStaticText[1]',
      }),
    );
  }

  get alertMessage() {
    return $(
      this.locator({
        android: 'id:android:id/message',
        ios: '//XCUIElementTypeAlert//XCUIElementTypeStaticText[2]',
      }),
    );
  }

  get okButton() {
    return $(
      this.locator({
        android: 'id:android:id/button1',
        ios: '~OK',
      }),
    );
  }

  get cancelButton() {
    return $(
      this.locator({
        android: 'id:android:id/button2',
        ios: '~Cancel',
      }),
    );
  }

  async isDialogVisible() {
    return await this.isDisplayed(this.alertContainer);
  }

  async getTitle() {
    return await this.getText(this.alertTitle, 'Dialog Title');
  }

  async getMessage() {
    return await this.getText(this.alertMessage, 'Dialog Message');
  }

  async accept() {
    await this.click(this.okButton, 'Dialog OK Button');
  }

  async dismiss() {
    await this.click(this.cancelButton, 'Dialog Cancel Button');
  }
}

export default new DialogComponent();
