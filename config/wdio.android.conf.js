import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as sharedConfig } from './wdio.shared.conf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appPath = process.env.ANDROID_APP_PATH
  ? path.resolve(__dirname, '..', process.env.ANDROID_APP_PATH)
  : undefined;

export const config = {
  ...sharedConfig,

  // Appium Server Connection
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  path: '/',

  // Appium Service automatically launches and manages Appium 2.x/3.x lifecycle
  services: [
    [
      'appium',
      {
        args: {
          relaxedSecurity: true,
          log: './logs/appium.log',
        },
        logPath: './logs',
      },
    ],
  ],

  // Android Capabilities
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Pixel_7_API_34',
      'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '14.0',
      ...(process.env.ANDROID_UDID ? { 'appium:udid': process.env.ANDROID_UDID } : {}),
      ...(appPath ? { 'appium:app': appPath } : {}),
      ...(process.env.ANDROID_APP_PACKAGE
        ? { 'appium:appPackage': process.env.ANDROID_APP_PACKAGE }
        : {}),
      ...(process.env.ANDROID_APP_ACTIVITY
        ? { 'appium:appActivity': process.env.ANDROID_APP_ACTIVITY }
        : {}),
      'appium:newCommandTimeout': 240,
      'appium:autoGrantPermissions': true,
      'appium:noReset': process.env.ANDROID_NO_RESET === 'true',
      'appium:fullReset': process.env.ANDROID_FULL_RESET === 'true',
      'appium:uiautomator2ServerInstallTimeout': 60000,
      'appium:androidInstallTimeout': 90000,
    },
  ],
};
