import dotenv from 'dotenv';

dotenv.config();

/**
 * Global Application & Driver Constants
 */
export const PLATFORM = {
  ANDROID: 'Android',
  IOS: 'iOS',
};

export const DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

export const APP_IDENTIFIERS = {
  ANDROID: {
    PACKAGE: process.env.ANDROID_APP_PACKAGE || 'com.saucelabs.mydemoapp.rn',
    ACTIVITY: process.env.ANDROID_APP_ACTIVITY || 'com.saucelabs.mydemoapp.rn.MainActivity',
  },
  IOS: {
    BUNDLE_ID: process.env.IOS_BUNDLE_ID || 'com.saucelabs.mydemoapp.rn',
  },
};

export const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  STEP: 'STEP',
  DEBUG: 'DEBUG',
};
