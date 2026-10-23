import fs from 'node:fs';
import path from 'node:path';
import { APP_IDENTIFIERS } from '../constants/app.constants.js';
import logger from './logger.js';
import allureHelper from './allure.helper.js';

class DriverUtils {
  /**
   * Determine if current platform is Android
   * @returns {boolean}
   */
  isAndroid() {
    return (driver.capabilities.platformName || '').toLowerCase() === 'android';
  }

  /**
   * Determine if current platform is iOS
   * @returns {boolean}
   */
  isIOS() {
    return (driver.capabilities.platformName || '').toLowerCase() === 'ios';
  }

  /**
   * Safely dismiss the on-screen keyboard
   */
  async hideKeyboard() {
    try {
      if (await driver.isKeyboardShown()) {
        logger.debug('Dismissing active keyboard');
        await driver.hideKeyboard();
      }
    } catch {
      // Swallowing keyboard not present or unsupported on device
    }
  }

  /**
   * Get the active application identifier based on platform
   * @returns {string}
   */
  getAppIdentifier() {
    return this.isAndroid() ? APP_IDENTIFIERS.ANDROID.PACKAGE : APP_IDENTIFIERS.IOS.BUNDLE_ID;
  }

  /**
   * Send the application to background for specified seconds and return to foreground
   * @param {number} [seconds=5]
   */
  async backgroundApp(seconds = 5) {
    logger.info(`Backgrounding app for ${seconds} seconds...`);
    await driver.background(seconds);
  }

  /**
   * Terminate the application
   * @param {string} [appId] optional package/bundle id override
   */
  async terminateApp(appId = this.getAppIdentifier()) {
    logger.info(`Terminating app: ${appId}`);
    await driver.terminateApp(appId);
  }

  /**
   * Activate / bring app to foreground
   * @param {string} [appId]
   */
  async activateApp(appId = this.getAppIdentifier()) {
    logger.info(`Activating app: ${appId}`);
    await driver.activateApp(appId);
  }

  /**
   * Reset the application state cleanly
   * @param {string} [appId]
   */
  async restartApp(appId = this.getAppIdentifier()) {
    logger.info(`Restarting app: ${appId}`);
    await this.terminateApp(appId);
    await this.activateApp(appId);
  }

  /**
   * Open app via deep link URL
   * @param {string} url
   */
  async openDeepLink(url) {
    logger.info(`Navigating to deep link: ${url}`);
    if (this.isAndroid()) {
      await driver.execute('mobile: deepLink', {
        url,
        package: APP_IDENTIFIERS.ANDROID.PACKAGE,
      });
    } else {
      // iOS Simulator deep link execution via Safari / Siri
      await driver.execute('mobile: deepLink', {
        url,
        bundleId: APP_IDENTIFIERS.IOS.BUNDLE_ID,
      });
    }
  }

  /**
   * Switch between NATIVE_APP and WEBVIEW contexts (for Hybrid Apps)
   * @param {string} contextName Target context name or 'WEBVIEW' / 'NATIVE_APP'
   */
  async switchContext(contextName) {
    const availableContexts = await driver.getContexts();
    logger.info(`Available contexts: ${JSON.stringify(availableContexts)}`);

    const targetContext = availableContexts.find(ctx =>
      ctx.toLowerCase().includes(contextName.toLowerCase()),
    );

    if (!targetContext) {
      throw new Error(
        `Context '${contextName}' not found in available contexts: ${JSON.stringify(availableContexts)}`,
      );
    }

    logger.info(`Switching context to: ${targetContext}`);
    await driver.switchContext(targetContext);
  }

  /**
   * Capture screenshot and attach to Allure and save to local directory
   * @param {string} [title='failure_screenshot']
   * @returns {Promise<string>} file path
   */
  async captureScreenshot(title = 'screenshot') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${title}_${timestamp}.png`;
    const screenshotsDir = path.resolve(process.cwd(), 'screenshots');

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const filePath = path.join(screenshotsDir, filename);
    const screenshotBuffer = await driver.takeScreenshot();

    fs.writeFileSync(filePath, screenshotBuffer, 'base64');
    logger.info(`Screenshot saved to: ${filePath}`);

    // Attach to Allure
    allureHelper.attachScreenshot(title, Buffer.from(screenshotBuffer, 'base64'));

    return filePath;
  }
}

export default new DriverUtils();
