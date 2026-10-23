/**
 * E2E Checkout test data fixtures
 */
export const CHECKOUT_DATA = {
  SHIPPING: {
    fullName: 'Jane Doe',
    addressLine1: '123 Automation Lane',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    country: 'United States',
  },
  PAYMENT: {
    cardHolderName: 'Jane Doe',
    cardNumber: '325812657568789',
    expirationDate: '03/28',
    securityCode: '123',
  },
  PRODUCT: {
    name: 'Sauce Labs Backpack',
    expectedPrice: '$29.99',
  },
};
