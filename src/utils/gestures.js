import { DIRECTION } from '../constants/app.constants.js';
import logger from './logger.js';

/**
 * Mobile gestures built using W3C Actions API (compatible with Appium 2.x/3.x).
 * Deprecated TouchAction/touchPerform is completely avoided.
 */
class Gestures {
  /**
   * Get device window dimensions
   * @returns {Promise<{width: number, height: number}>}
   */
  async getWindowSize() {
    return await driver.getWindowSize();
  }

  /**
   * Universal W3C pointer drag/swipe from point A to point B
   * @param {{x: number, y: number}} from
   * @param {{x: number, y: number}} to
   * @param {number} [duration=800] duration in ms
   */
  async swipe(from, to, duration = 800) {
    logger.debug(`Performing swipe from (${from.x}, ${from.y}) to (${to.x}, ${to.y})`);

    await driver
      .action('pointer', {
        parameters: { pointerType: 'touch' },
      })
      .move({ x: Math.round(from.x), y: Math.round(from.y) })
      .down()
      .pause(100)
      .move({ duration, x: Math.round(to.x), y: Math.round(to.y) })
      .up()
      .perform();

    // Brief stabilization pause after gesture
    await driver.pause(400);
  }

  /**
   * Scroll down screen (swipe finger upwards)
   * @param {number} [percentage=0.6] fraction of screen height to scroll
   */
  async scrollDown(percentage = 0.6) {
    const { width, height } = await this.getWindowSize();
    const startX = width * 0.5;
    const startY = height * 0.8;
    const endY = startY - height * percentage;

    await this.swipe({ x: startX, y: startY }, { x: startX, y: endY });
  }

  /**
   * Scroll up screen (swipe finger downwards)
   * @param {number} [percentage=0.6] fraction of screen height to scroll
   */
  async scrollUp(percentage = 0.6) {
    const { width, height } = await this.getWindowSize();
    const startX = width * 0.5;
    const startY = height * 0.2;
    const endY = startY + height * percentage;

    await this.swipe({ x: startX, y: startY }, { x: startX, y: endY });
  }

  /**
   * Swipe left (e.g. carousels or cards)
   * @param {number} [percentage=0.7]
   */
  async swipeLeft(percentage = 0.7) {
    const { width, height } = await this.getWindowSize();
    const startY = height * 0.5;
    const startX = width * 0.85;
    const endX = startX - width * percentage;

    await this.swipe({ x: startX, y: startY }, { x: endX, y: startY });
  }

  /**
   * Swipe right (e.g. carousels, back gestures)
   * @param {number} [percentage=0.7]
   */
  async swipeRight(percentage = 0.7) {
    const { width, height } = await this.getWindowSize();
    const startY = height * 0.5;
    const startX = width * 0.15;
    const endX = startX + width * percentage;

    await this.swipe({ x: startX, y: startY }, { x: endX, y: startY });
  }

  /**
   * Repeatedly scrolls in the given direction until target element is displayed or max scrolls reached.
   * @param {() => Promise<WebdriverIO.Element>} elementGetter Function returning the WebdriverIO element
   * @param {number} [maxScrolls=6] Maximum scroll attempts
   * @param {'up'|'down'} [direction=DIRECTION.DOWN] Direction to scroll
   * @returns {Promise<WebdriverIO.Element>}
   */
  async scrollUntilVisible(elementGetter, maxScrolls = 6, direction = DIRECTION.DOWN) {
    for (let attempt = 1; attempt <= maxScrolls; attempt++) {
      try {
        const el = await elementGetter();
        if (await el.isDisplayed()) {
          logger.debug(`Target element found and visible on scroll attempt ${attempt}`);
          return el;
        }
      } catch {
        // Element not yet in DOM, proceed with scroll
      }

      logger.debug(`Scrolling ${direction} (attempt ${attempt}/${maxScrolls})...`);
      if (direction === DIRECTION.DOWN) {
        await this.scrollDown(0.5);
      } else {
        await this.scrollUp(0.5);
      }
    }

    // Final attempt check
    const target = await elementGetter();
    if (await target.isDisplayed()) {
      return target;
    }

    throw new Error(`Element not visible after scrolling ${direction} for ${maxScrolls} attempts.`);
  }

  /**
   * Universal tap at absolute coordinates using W3C pointer actions
   * @param {number} x
   * @param {number} y
   */
  async tap(x, y) {
    await driver
      .action('pointer', {
        parameters: { pointerType: 'touch' },
      })
      .move({ x: Math.round(x), y: Math.round(y) })
      .down()
      .pause(50)
      .up()
      .perform();
  }

  /**
   * Pull to refresh gesture at the top of a scroll view
   */
  async pullToRefresh() {
    const { width, height } = await this.getWindowSize();
    const startX = width * 0.5;
    const startY = height * 0.25;
    const endY = height * 0.75;

    logger.debug('Executing pull to refresh gesture');
    await this.swipe({ x: startX, y: startY }, { x: startX, y: endY }, 1200);
    await driver.pause(1000);
  }
}

export default new Gestures();
