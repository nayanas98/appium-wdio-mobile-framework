import loginScreen from '../../screens/login.screen.js';
import navbarComponent from '../../components/navbar.component.js';
import { USERS } from '../../data/users.data.js';
import allureHelper, { SEVERITY } from '../../utils/allure.helper.js';

describe('E2E Suite - Mobile Authentication Flows', () => {
  beforeAll(async () => {
    allureHelper.setFeature('User Authentication');
  });

  beforeEach(async () => {
    // Navigate to Login Screen via Navigation Bar/Menu
    await allureHelper.step('Navigate to Login Screen', async () => {
      await navbarComponent.openMenu();
      const loginOption = await $('~menu item log in');
      if (await loginOption.isDisplayed()) {
        await loginOption.click();
      }
    });
  });

  it('should display error when submitting empty credentials', async () => {
    allureHelper.setSeverity(SEVERITY.NORMAL);

    await allureHelper.step('Click login with blank username and password', async () => {
      await loginScreen.login(USERS.EMPTY_CREDENTIALS.username, USERS.EMPTY_CREDENTIALS.password);
    });

    await allureHelper.step('Validate required validation error is displayed', async () => {
      const isErrorShown = await loginScreen.isErrorDisplayed();
      expect(isErrorShown).toBeTrue();

      const errorText = await loginScreen.getErrorMessageText();
      expect(errorText).toContain(USERS.EMPTY_CREDENTIALS.expectedError);
    });
  });

  it('should display error message for locked out user', async () => {
    allureHelper.setSeverity(SEVERITY.CRITICAL);

    await allureHelper.step('Attempt login with locked-out credentials', async () => {
      await loginScreen.login(USERS.LOCKED_OUT.username, USERS.LOCKED_OUT.password);
    });

    await allureHelper.step('Verify locked-out notification is shown', async () => {
      const isErrorShown = await loginScreen.isErrorDisplayed();
      expect(isErrorShown).toBeTrue();

      const errorText = await loginScreen.getErrorMessageText();
      expect(errorText).toContain(USERS.LOCKED_OUT.expectedError);
    });
  });

  it('should display error message when incorrect password is provided', async () => {
    allureHelper.setSeverity(SEVERITY.CRITICAL);

    await allureHelper.step('Attempt login with incorrect password', async () => {
      await loginScreen.login(USERS.INVALID_PASSWORD.username, USERS.INVALID_PASSWORD.password);
    });

    await allureHelper.step('Verify mismatch credentials error', async () => {
      const isErrorShown = await loginScreen.isErrorDisplayed();
      expect(isErrorShown).toBeTrue();

      const errorText = await loginScreen.getErrorMessageText();
      expect(errorText).toContain(USERS.INVALID_PASSWORD.expectedError);
    });
  });

  it('should successfully log in with valid credentials', async () => {
    allureHelper.setSeverity(SEVERITY.BLOCKER);

    await allureHelper.step('Login with valid user credentials', async () => {
      await loginScreen.login(USERS.VALID.username, USERS.VALID.password);
    });

    await allureHelper.step('Verify user is redirected away from login screen', async () => {
      const isLoginDisplayed = await loginScreen.isDisplayed(loginScreen.loginButton);
      expect(isLoginDisplayed).toBeFalse();
    });
  });
});
