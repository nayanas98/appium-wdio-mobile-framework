import { TIMEOUTS } from '../constants/timeouts.constants.js';
import logger from '../utils/logger.js';
import driverUtils from '../utils/driver.utils.js';
import gestures from '../utils/gestures.js';

/**
 * Base Screen Object
 * Provides robust, self-healing element interactions, smart waits,
 * cross-platform locator resolution, and comprehensive logging.
 */
export default class BaseScreen {
  /**
   * @param {string|WebdriverIO.Element} [screenSelector] Unique selector identifying this screen
   */
  constructor(screenSelector = null) {
    this.screenSelector = screenSelector;
  }

  /**
   * Helper to resolve platform-specific locators dynamically
   * @param {{android: string, ios: string}} locators
   * @returns {string} Platform-specific selector
   */
  locator(locators) {
    if (driverUtils.isAndroid()) {
      if (!locators.android) {
        throw new Error('Android locator not defined for element');
      }
      return locators.android;
    }

    if (driverUtils.isIOS()) {
      if (!locators.ios) {
        throw new Error('iOS locator not defined for element');
      }
      return locators.ios;
    }

    // Default fallback
    return locators.android || locators.ios;
  }

  /**
   * Assert the screen is rendered by checking its primary selector
   * @param {number} [timeout=TIMEOUTS.DEFAULT]
   * @returns {Promise<boolean>}
   */
  async waitForIsShown(timeout = TIMEOUTS.DEFAULT) {
    if (!this.screenSelector) return true;

    const el =
      typeof this.screenSelector === 'string'
        ? await $(this.screenSelector)
        : await this.screenSelector;

    try {
      await el.waitForDisplayed({
        timeout,
        timeoutMsg: `Screen [${this.constructor.name}] was not displayed within ${timeout}ms`,
      });
      logger.info(`Screen [${this.constructor.name}] loaded successfully`);
      return true;
    } catch (error) {
      logger.error(`Screen [${this.constructor.name}] failed to load: ${error.message}`);
      throw error;
    }
  }

  /**
   * Smart click with automatic clickable check and error diagnostics
   * @param {WebdriverIO.Element|Promise<WebdriverIO.Element>} element
   * @param {string} [elementName='Element']
   */
  async click(element, elementName = 'Element') {
    const el = await element;
    logger.debug(`Clicking ${elementName}`);
    try {
      await el.waitForDisplayed({ timeout: TIMEOUTS.DEFAULT });
      await el.waitForClickable({ timeout: TIMEOUTS.DEFAULT });
      await el.click();
      logger.info(`Clicked ${elementName}`);
    } catch (error) {
      logger.error(`Failed to click ${elementName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Safe input field population with clear and optional keyboard dismiss
   * @param {WebdriverIO.Element|Promise<WebdriverIO.Element>} element
   * @param {string} value
   * @param {string} [elementName='Input Field']
   * @param {boolean} [dismissKeyboard=true]
   */
  async setValue(element, value, elementName = 'Input Field', dismissKeyboard = true) {
    const el = await element;
    logger.debug(`Entering text in ${elementName}`);
    try {
      await el.waitForDisplayed({ timeout: TIMEOUTS.DEFAULT });
      await el.clearValue();
      await el.setValue(value);
      logger.info(`Entered value in ${elementName}`);

      if (dismissKeyboard) {
        await driverUtils.hideKeyboard();
      }
    } catch (error) {
      logger.error(`Failed to set value on ${elementName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieve text from element with visibility check
   * @param {WebdriverIO.Element|Promise<WebdriverIO.Element>} element
   * @param {string} [elementName='Element']
   * @returns {Promise<string>}
   */
  async getText(element, elementName = 'Element') {
    const el = await element;
    try {
      await el.waitForDisplayed({ timeout: TIMEOUTS.DEFAULT });
      const text = await el.getText();
      logger.debug(`Read text "${text}" from ${elementName}`);
      return text.trim();
    } catch (error) {
      logger.error(`Failed to read text from ${elementName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Safe visibility verification returning boolean without throwing on timeout
   * @param {WebdriverIO.Element|Promise<WebdriverIO.Element>} element
   * @param {number} [timeout=TIMEOUTS.SHORT]
   * @returns {Promise<boolean>}
   */
  async isDisplayed(element, timeout = TIMEOUTS.SHORT) {
    try {
      const el = await element;
      return await el.waitForDisplayed({ timeout, reverse: false });
    } catch {
      return false;
    }
  }

  /**
   * Wait until element completely disappears (useful for spinners/overlays)
   * @param {WebdriverIO.Element|Promise<WebdriverIO.Element>} element
   * @param {number} [timeout=TIMEOUTS.DEFAULT]
   */
  async waitUntilDisappear(element, timeout = TIMEOUTS.DEFAULT) {
    const el = await element;
    logger.debug('Waiting for element to disappear...');
    await el.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: `Element remained displayed after ${timeout}ms`,
    });
  }

  /**
   * Scroll down screen until element is visible, then return it
   * @param {() => Promise<WebdriverIO.Element>} elementGetter
   * @param {number} [maxScrolls=5]
   */
  async scrollAndFind(elementGetter, maxScrolls = 5) {
    return await gestures.scrollUntilVisible(elementGetter, maxScrolls);
  }
}
