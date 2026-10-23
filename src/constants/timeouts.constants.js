/**
 * Timeouts used across WebdriverIO element waits and session lifecycles.
 * Centralizing timeouts prevents arbitrary hardcoded waits and flaky tests.
 */
export const TIMEOUTS = {
  // Micro wait for quick animations / transient elements (ms)
  IMMEDIATE: 2000,

  // Short wait for element visibility, attribute changes (ms)
  SHORT: 5000,

  // Default wait for standard UI transitions, navigation (ms)
  DEFAULT: parseInt(process.env.DEFAULT_TIMEOUT, 10) || 15000,

  // Long wait for network calls, heavy screen transitions, app boot (ms)
  LONG: 30000,

  // Extra long wait for cold app launch or heavy APK/IPA install (ms)
  APP_LAUNCH: 60000,

  // Interval for polling element conditions
  POLL_INTERVAL: 500,
};
