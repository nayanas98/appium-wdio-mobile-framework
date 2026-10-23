# 📱 Enterprise Mobile Automation Framework (SDET Grade)

[![WebdriverIO](https://img.shields.io/badge/WebdriverIO-v9.x-EA5906?logo=webdriverio)](https://webdriver.io/)
[![Appium](https://img.shields.io/badge/Appium-v2%2B-662d91?logo=appium)](https://appium.io/)
[![Jasmine](https://img.shields.io/badge/Jasmine-Framework-8a4182?logo=jasmine)](https://jasmine.github.io/)
[![Allure](https://img.shields.io/badge/Allure-Reporter-FF69B4)](https://allurereport.org/)
[![JavaScript](https://img.shields.io/badge/ECMAScript-ESM-F7DF1E?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A scalable, production-grade mobile test automation framework engineered using **WebdriverIO**, **Appium 2.x/3.x**, and the **Jasmine** BDD test runner in modern **JavaScript (ES Modules)**.

Built following enterprise SDET best practices: Screen Object Model (SOM), W3C Actions gestures, self-healing smart waits, centralized configuration, and Allure test reporting with automatic failure screenshot capture.

---

## 🏛️ Architecture & SDET Design Principles

```
fromScratch/
├── .github/
│   └── workflows/
│       └── mobile-tests.yml        # CI/CD GitHub Actions pipeline
├── apps/
│   └── .gitkeep                    # Directory for .apk / .ipa app binaries
├── config/
│   ├── wdio.shared.conf.js         # Base WDIO config: Jasmine opts, hooks, Allure, screenshot-on-fail
│   ├── wdio.android.conf.js        # Android UiAutomator2 & Appium service config
│   ├── wdio.ios.conf.js            # iOS XCUITest config
│   └── wdio.bs.conf.js             # BrowserStack / Cloud device farm config
├── src/
│   ├── components/                 # Reusable UI widgets across multiple screens
│   │   ├── dialog.component.js     # Native alert dialogs, modal handling
│   │   └── navbar.component.js     # Bottom bar, header navigation & cart badge
│   ├── constants/                  # Single source of truth for values (No magic strings)
│   │   ├── app.constants.js        # Package names, bundle IDs, activities, gestures
│   │   └── timeouts.constants.js   # Standardized timeouts (SHORT, DEFAULT, LONG)
│   ├── data/                       # Dynamic & static test fixtures
│   │   ├── checkout.data.js        # E2E address, payment, and item fixtures
│   │   └── users.data.js           # Authentication datasets (valid, locked, invalid)
│   ├── screens/                    # Screen Object Model (POM for Mobile)
│   │   ├── base.screen.js          # Base Screen: dynamic locators, smart waits, clicks
│   │   ├── login.screen.js         # Login screen object & validations
│   │   ├── products.screen.js      # Products catalog & dynamic element scrolling
│   │   └── cart.screen.js          # Cart review & checkout entry
│   ├── specs/                      # Jasmine test specifications
│   │   ├── smoke/
│   │   │   └── app.launch.spec.js  # App cold boot & critical UI rendering checks
│   │   └── e2e/
│   │       ├── checkout.spec.js    # Complete purchase flow journey
│   │       └── login.spec.js       # Positive, negative, and boundary auth tests
│   └── utils/                      # Helper libraries & cross-cutting concerns
│       ├── allure.helper.js        # Allure steps, severity tags, attachments
│       ├── driver.utils.js         # App lifecycle, deep linking, contexts, keyboard
│       ├── gestures.js             # W3C pointer actions: swipe, scroll-to, pull-to-refresh
│       └── logger.js               # SDET structured console logger with timestamps
├── .env.example                    # Environment variables template
├── .env                            # Active environment configuration
├── .eslintrc.json / eslint.config.js # Linting standards with Jasmine globals
├── .prettierrc                     # Code style formatter rules
├── package.json                    # Executable scripts & dependencies
└── README.md                       # Comprehensive framework documentation
```

### Key SDET Architectural Highlights:

1. **Zero Implicit Waits Policy**: Implicit waits cause multiplying delays and race conditions with explicit waits. All element lookups use explicit smart waits with self-healing strategies in `BaseScreen`.
2. **Modern W3C Actions API**: Completely eliminates legacy, deprecated `TouchActions` / `touchPerform`. All gestures (`swipe`, `scrollDown`, `scrollUntilVisible`, `pinch`, `tap`) use W3C pointer actions compatible with Appium 2.x and 3.x.
3. **Cross-Platform Locators**: Screen objects resolve selectors dynamically for Android (`accessibility id`, `id`, `UiSelector`) and iOS (`predicate string`, `class chain`, `accessibility id`) without code duplication.
4. **Resilient Failure Capture**: The `afterTest` hook automatically detects test failures, captures device screenshots, and attaches them directly to the corresponding test case in Allure.
5. **Hybrid App Ready**: Includes built-in context switching (`switchContext('WEBVIEW')` / `switchContext('NATIVE_APP')`) for apps containing webviews.

---

## ⚙️ Prerequisites & Setup

### 1. Development Tools
- **Node.js**: v18.0.0 or higher (v20+ recommended).
- **Java Development Kit (JDK)**: JDK 17 or higher.
- **Android Studio & SDK**:
  - `ANDROID_HOME` environment variable configured.
  - `platform-tools` (`adb`) and `emulator` added to your system `PATH`.
- **Xcode** (macOS only, for iOS testing):
  - Xcode 15+ and Command Line Tools installed.

### 2. Appium 2 Setup
Verify Appium 2 and drivers are available:
```bash
# Verify Appium CLI
appium --version

# Verify UiAutomator2 driver is installed
appium driver list

# If not installed, run:
appium driver install uiautomator2
appium driver install xcuitest # (macOS only for iOS)
```

### 3. Install Framework Dependencies
```bash
npm install
```

---

## 🔧 Environment Configuration (`.env`)

Copy `.env.example` to `.env` and configure your local or emulator parameters:

```ini
# Appium Server
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723
APPIUM_LOG_LEVEL=info

# Android Device & Application
ANDROID_DEVICE_NAME=Pixel_7_API_34
ANDROID_PLATFORM_VERSION=14.0
ANDROID_UDID=emulator-5554
ANDROID_APP_PATH=./apps/mda-2.2.0-25.apk
ANDROID_APP_PACKAGE=com.saucelabs.mydemoapp.android
ANDROID_APP_ACTIVITY=com.saucelabs.mydemoapp.android.view.activities.SplashActivity
ANDROID_NO_RESET=false

# iOS Device & Application
IOS_DEVICE_NAME=iPhone 15
IOS_PLATFORM_VERSION=17.2
IOS_APP_PATH=./apps/MyRNDemoApp.app
IOS_BUNDLE_ID=com.saucelabs.mydemoapp.rn

# Timeouts & Retries
DEFAULT_TIMEOUT=15000
SPEC_FILE_RETRY_ATTEMPTS=0
```

> **Sample App**: The locators and test suites are pre-configured to work seamlessly with the industry-standard [Sauce Labs My Demo App](https://github.com/saucelabs/my-demo-app-rn/releases) (Android `.apk` or iOS `.app`). Download the latest release `.apk` and drop it into `./apps/`.

---

## 🚀 Test Execution Commands

| Command | Description |
| :--- | :--- |
| `npm run test:android` | Execute all Android test suites (Smoke + E2E) |
| `npm run test:android:smoke` | Execute only Android Smoke suite (`app.launch.spec.js`) |
| `npm run test:android:e2e` | Execute only Android E2E suites (`login.spec.js`, `checkout.spec.js`) |
| `npm run test:ios` | Execute all iOS test suites |
| `npm run test:ios:smoke` | Execute only iOS Smoke suite |
| `npm run test:ios:e2e` | Execute only iOS E2E suites |
| `npm run test:bs:android` | Execute tests on BrowserStack Real Devices Cloud |
| `npm run lint` | Run ESLint code quality checks across `src/` and `config/` |
| `npm run format` | Auto-format entire project using Prettier |

### Run Specific Specs or Tags via CLI:
```bash
# Run a specific test file
npx wdio run ./config/wdio.android.conf.js --spec ./src/specs/e2e/login.spec.js

# Override device name on the fly
ANDROID_DEVICE_NAME="Pixel_6_API_33" npm run test:android:smoke
```

---

## 📊 Allure Test Reporting

Generate rich, interactive HTML reports with detailed test steps, execution times, severity badges, and failure screenshots:

```bash
# Generate the report from test results
npm run report:generate

# Open the report in your default browser
npm run report:open
```

---

## 💡 How to Add New Screens and Tests

### 1. Create a Screen Object (`src/screens/`)
Inherit from `BaseScreen` and define cross-platform locators:

```javascript
import BaseScreen from './base.screen.js';

class SettingsScreen extends BaseScreen {
  constructor() {
    super('~settings container'); // Screen identifier
  }

  get notificationsToggle() {
    return $(
      this.locator({
        android: '~notifications switch',
        ios: '//XCUIElementTypeSwitch[@name="notifications"]',
      })
    );
  }

  async toggleNotifications() {
    await this.click(this.notificationsToggle, 'Notifications Switch');
  }
}

export default new SettingsScreen();
```

### 2. Write a Jasmine Spec (`src/specs/`)
```javascript
import settingsScreen from '../../screens/settings.screen.js';
import allureHelper, { SEVERITY } from '../../utils/allure.helper.js';

describe('Settings Suite - Notification Preferences', () => {
  beforeAll(async () => {
    allureHelper.setFeature('User Settings');
    allureHelper.setSeverity(SEVERITY.NORMAL);
  });

  it('should toggle notifications on and off', async () => {
    await allureHelper.step('Toggle notifications', async () => {
      await settingsScreen.toggleNotifications();
      const isChecked = await settingsScreen.notificationsToggle.getAttribute('checked');
      expect(isChecked).toBe('true');
    });
  });
});
```

---

## 🖐️ Gestures API Reference (`gestures.js`)

```javascript
import gestures from '../utils/gestures.js';

// Scroll down half a screen
await gestures.scrollDown();

// Scroll until element appears (eliminates guesswork on long lists)
const submitButton = await gestures.scrollUntilVisible(async () => $('#submit'));

// Horizontal swipe for carousels
await gestures.swipeLeft();

// Pull to refresh at top of scroll views
await gestures.pullToRefresh();
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

A fully automated CI workflow is included in `.github/workflows/mobile-tests.yml`:
- Provisions JDK 17 and Android SDK.
- Starts a hardware-accelerated Android Emulator (Pixel 7 / API 34).
- Runs the test suite via `npm run test:android:smoke`.
- Publishes the Allure HTML report and archives failure screenshots on any regression.
