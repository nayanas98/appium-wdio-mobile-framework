import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as sharedConfig } from './wdio.shared.conf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appPath = process.env.IOS_APP_PATH
  ? path.resolve(__dirname, '..', process.env.IOS_APP_PATH)
  : undefined;

export const config = {
  ...sharedConfig,

  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  path: '/',

  services: [
    [
      'appium',
      {
        args: {
          relaxedSecurity: true,
          log: './logs/appium-ios.log',
        },
        logPath: './logs',
      },
    ],
  ],

  // iOS Capabilities
  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 15',
      'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '17.2',
      ...(process.env.IOS_UDID ? { 'appium:udid': process.env.IOS_UDID } : {}),
      ...(appPath ? { 'appium:app': appPath } : {}),
      ...(process.env.IOS_BUNDLE_ID ? { 'appium:bundleId': process.env.IOS_BUNDLE_ID } : {}),
      'appium:newCommandTimeout': 240,
      'appium:noReset': process.env.IOS_NO_RESET === 'true',
      'appium:wdaLaunchTimeout': 90000,
      'appium:wdaConnectionTimeout': 90000,
    },
  ],
};
