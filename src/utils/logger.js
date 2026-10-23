import { LOG_LEVELS } from '../constants/app.constants.js';

// ANSI terminal color codes for clear visual debugging
const COLORS = {
  RESET: '\x1b[0m',
  CYAN: '\x1b[36m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  MAGENTA: '\x1b[35m',
  GRAY: '\x1b[90m',
};

class Logger {
  #formatTime() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  }

  #log(level, color, message, meta = '') {
    const timestamp = this.#formatTime();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    console.log(
      `${COLORS.GRAY}[${timestamp}]${COLORS.RESET} ${color}[${level}]${COLORS.RESET} ${message}${metaString}`,
    );
  }

  /**
   * Log standard informational message
   * @param {string} message
   * @param {any} [meta]
   */
  info(message, meta) {
    this.#log(LOG_LEVELS.INFO, COLORS.CYAN, message, meta);
  }

  /**
   * Log high-level user scenario / test step
   * @param {string} stepName
   */
  step(stepName) {
    this.#log(LOG_LEVELS.STEP, COLORS.MAGENTA, `➡️ STEP: ${stepName}`);
  }

  /**
   * Log warning message
   * @param {string} message
   * @param {any} [meta]
   */
  warn(message, meta) {
    this.#log(LOG_LEVELS.WARN, COLORS.YELLOW, message, meta);
  }

  /**
   * Log error message
   * @param {string} message
   * @param {Error|any} [error]
   */
  error(message, error) {
    this.#log(LOG_LEVELS.ERROR, COLORS.RED, message, error?.stack || error);
  }

  /**
   * Log debug level detail
   * @param {string} message
   * @param {any} [meta]
   */
  debug(message, meta) {
    if (process.env.APPIUM_LOG_LEVEL === 'debug' || process.env.DEBUG === 'true') {
      this.#log(LOG_LEVELS.DEBUG, COLORS.GRAY, message, meta);
    }
  }
}

export default new Logger();
