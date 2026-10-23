import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import logger from '../src/utils/logger.js';
import allureHelper from '../src/utils/allure.helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const specsDir = path.resolve(__dirname, '../src/specs').replace(/\\/g, '/');

// Load environment variables from .env file
dotenv.config();

export const config = {
  // ====================
  // Runner Configuration
  // ====================
  runner: 'local',
  maxInstances: parseInt(process.env.MAX_INSTANCES, 10) || 1,
  logLevel: process.env.APPIUM_LOG_LEVEL || 'info',
  bail: 0,
  waitforTimeout: parseInt(process.env.DEFAULT_TIMEOUT, 10) || 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,

  // ==================
  // Specify Test Files
  // ==================
  specs: [`${specsDir}/**/*.spec.js`],
  suites: {
    smoke: [`${specsDir}/smoke/**/*.spec.js`],
    e2e: [`${specsDir}/e2e/**/*.spec.js`],
    regression: [`${specsDir}/smoke/**/*.spec.js`, `${specsDir}/e2e/**/*.spec.js`],
  },

  // ===================
  // Test Configurations
  // ===================
  framework: 'jasmine',
  jasmineOpts: {
    defaultTimeoutInterval: 120000,
    stopSpecOnExpectationFailure: false,
    expectationResultHandler: function (passed, assertion) {
      if (!passed) {
        logger.error(`Jasmine Assertion Failed: ${assertion.message}`);
      }
    },
  },

  // =================
  // Reporters Setup
  // =================
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: false,
      },
    ],
  ],

  // ======================================
  // SDET Lifecycle Hooks & Self-Healing
  // ======================================

  /**
   * Executed before test execution begins.
   */
  before: async function (capabilities, specs) {
    logger.info('Initializing Mobile Automation Session...');
    logger.info(`Platform: ${capabilities.platformName}`);
    logger.info(`Device: ${capabilities['appium:deviceName'] || capabilities.deviceName}`);
    logger.info(`Spec file: ${specs.join(', ')}`);

    // SDET Golden Rule: Set implicit wait to 0 to avoid race conditions with explicit smart waits
    await driver.setTimeouts(0);
  },

  /**
   * Executed before each Jasmine spec (it block) begins.
   */
  beforeTest: function (test, _context) {
    logger.info(`----------------------------------------------------------------`);
    logger.info(`TEST START: ${test.fullName || test.description}`);
    logger.info(`----------------------------------------------------------------`);
  },

  /**
   * Executed after each Jasmine spec finishes.
   * Auto-captures screenshot and attaches to Allure on failure.
   */
  afterTest: async function (test, _context, { _error, _result, duration, passed, _retries }) {
    if (!passed) {
      logger.error(`TEST FAILED: ${test.fullName || test.description}`);
      try {
        const screenshot = await driver.takeScreenshot();
        allureHelper.attachScreenshot(
          `Failure Screenshot - ${test.description}`,
          Buffer.from(screenshot, 'base64'),
        );
        logger.info('Failure screenshot successfully captured and attached to Allure report.');
      } catch (screenshotError) {
        logger.error(`Failed to capture failure screenshot: ${screenshotError.message}`);
      }
    } else {
      logger.info(`TEST PASSED: ${test.fullName || test.description} (${duration}ms)`);
    }
  },

  /**
   * Executed after the entire test suite completes.
   */
  afterSuite: function (suite) {
    logger.info(`SUITE FINISHED: ${suite.description}`);
  },

  /**
   * Clean-up after session ends
   */
  afterSession: async function (_config, _capabilities, _specs) {
    logger.info('Closing session and releasing resources.');
  },
};
