import { config as sharedConfig } from './wdio.shared.conf.js';

export const config = {
  ...sharedConfig,

  // BrowserStack Cloud Infrastructure
  user: process.env.BS_USER,
  key: process.env.BS_KEY,
  hostname: 'hub.browserstack.com',
  services: ['browserstack'],

  capabilities: [
    {
      platformName: 'android',
      'appium:platformVersion': '14.0',
      'appium:deviceName': 'Google Pixel 8',
      'appium:app': process.env.BS_APP_ANDROID,
      'bstack:options': {
        projectName: 'Mobile E2E Automation',
        buildName: `Build_${new Date().toISOString().slice(0, 10)}`,
        sessionName: 'Android Regression Suite',
        debug: true,
        networkLogs: true,
      },
    },
  ],
};
