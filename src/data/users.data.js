/**
 * Test user fixtures for authentication flows
 */
export const USERS = {
  VALID: {
    username: 'bod@example.com',
    password: '10203040',
    description: 'Standard active customer account',
  },
  LOCKED_OUT: {
    username: 'alice@example.com',
    password: '10203040',
    description: 'Account flagged as locked due to excessive failed attempts',
    expectedError: 'Sorry, this user has been locked out.',
  },
  INVALID_PASSWORD: {
    username: 'bod@example.com',
    password: 'WrongPassword999',
    description: 'Valid username with invalid password',
    expectedError: 'Provided credentials do not match any user in this service.',
  },
  EMPTY_CREDENTIALS: {
    username: '',
    password: '',
    expectedError: 'Username is required',
  },
};
