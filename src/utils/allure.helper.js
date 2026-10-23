import allureReporter from '@wdio/allure-reporter';
import logger from './logger.js';

export const SEVERITY = {
  BLOCKER: 'blocker',
  CRITICAL: 'critical',
  NORMAL: 'normal',
  MINOR: 'minor',
  TRIVIAL: 'trivial',
};

class AllureHelper {
  /**
   * Wrap an action inside an Allure step and log it
   * @param {string} stepDescription
   * @param {Function} [action]
   */
  async step(stepDescription, action) {
    logger.step(stepDescription);
    try {
      allureReporter.startStep(stepDescription);
      if (typeof action === 'function') {
        const result = await action();
        allureReporter.endStep('passed');
        return result;
      }
      allureReporter.endStep('passed');
    } catch (error) {
      allureReporter.endStep('failed');
      logger.error(`Step failed: ${stepDescription}`, error);
      throw error;
    }
  }

  /**
   * Set test severity level in report
   * @param {string} severity SEVERITY enum
   */
  setSeverity(severity) {
    try {
      allureReporter.addSeverity(severity);
    } catch {
      // Ignored if reporter is disabled
    }
  }

  /**
   * Tag test with Feature
   * @param {string} featureName
   */
  setFeature(featureName) {
    try {
      allureReporter.addFeature(featureName);
    } catch {
      // Ignored if reporter is disabled
    }
  }

  /**
   * Tag test with Story
   * @param {string} storyName
   */
  setStory(storyName) {
    try {
      allureReporter.addStory(storyName);
    } catch {
      // Ignored if reporter is disabled
    }
  }

  /**
   * Attach a screenshot buffer or base64 to Allure report
   * @param {string} name
   * @param {Buffer|string} content
   * @param {string} [type='image/png']
   */
  attachScreenshot(name, content, type = 'image/png') {
    try {
      allureReporter.addAttachment(name, content, type);
    } catch (err) {
      logger.warn(`Could not attach screenshot to Allure: ${err.message}`);
    }
  }

  /**
   * Attach arbitrary text / JSON payload to Allure
   * @param {string} name
   * @param {any} data
   */
  attachData(name, data) {
    try {
      const formatted = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
      allureReporter.addAttachment(name, formatted, 'application/json');
    } catch (err) {
      logger.warn(`Could not attach data to Allure: ${err.message}`);
    }
  }
}

export default new AllureHelper();
