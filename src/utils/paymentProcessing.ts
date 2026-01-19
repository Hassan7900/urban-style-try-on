import axios from 'axios';
import { paymentConfig, PAYMENT_GATEWAYS } from '@/config/paymentConfig';

const isMockEnabled = import.meta.env.VITE_ENABLE_PAYMENT_MOCK === 'true';

const mockPaymentResponse = (method: string, orderDetails: any) => ({
  success: true,
  status: 'mocked',
  message: `${method} payment mocked (no backend configured)`,
  orderId: orderDetails.orderNumber,
  paymentMethod: method,
});

const shouldMock = (missingConfig: boolean) =>
  isMockEnabled || (import.meta.env.DEV && missingConfig);

// Stripe Payment Handler
export const processStripePayment = async (
  token: string,
  amount: number,
  orderDetails: any
) => {
  const missingConfig = !paymentConfig.stripePublicKey;
  if (shouldMock(missingConfig)) {
    console.warn('Mocking Stripe payment - backend/config not available');
    return mockPaymentResponse('stripe', orderDetails);
  }
  try {
    const response = await axios.post('/api/payments/stripe', {
      token,
      amount,
      currency: paymentConfig.currency,
      description: `Urban Wear Order - ${orderDetails.orderNumber}`,
      metadata: {
        orderId: orderDetails.orderNumber,
        customerEmail: orderDetails.customerEmail,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Stripe payment error:', error);
    throw new Error('Stripe payment failed');
  }
};

// Google Pay Handler
export const processGooglePayPayment = async (
  token: string,
  amount: number,
  orderDetails: any
) => {
  const missingConfig = !paymentConfig.googlePayClientId;
  if (shouldMock(missingConfig)) {
    console.warn('Mocking Google Pay - backend/config not available');
    return mockPaymentResponse('google_pay', orderDetails);
  }
  try {
    const response = await axios.post('/api/payments/google-pay', {
      token,
      amount,
      currency: paymentConfig.currency,
      description: `Urban Wear Order - ${orderDetails.orderNumber}`,
      orderId: orderDetails.orderNumber,
    });
    return response.data;
  } catch (error) {
    console.error('Google Pay error:', error);
    throw new Error('Google Pay transaction failed');
  }
};

// JazzCash Handler
export const processJazzCashPayment = async (
  phoneNumber: string,
  amount: number,
  orderDetails: any
) => {
  const missingConfig =
    !paymentConfig.jazzCashMerchantId || !paymentConfig.jazzCashPassword;
  if (shouldMock(missingConfig)) {
    console.warn('Mocking JazzCash - backend/config not available');
    return mockPaymentResponse('jazz_cash', orderDetails);
  }
  try {
    // JazzCash requires specific formatting
    const response = await axios.post('/api/payments/jazz-cash', {
      merchantId: paymentConfig.jazzCashMerchantId,
      password: paymentConfig.jazzCashPassword,
      ppAmount: amount,
      ppBillReference: orderDetails.orderNumber,
      ppDescription: `Urban Wear Order`,
      ppLanguage: 'EN',
      ppNotificationURL: `${window.location.origin}/api/payments/jazz-cash/callback`,
      ppReturnURL: `${window.location.origin}/order-confirmation`,
      ppExpiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    console.error('JazzCash payment error:', error);
    throw new Error('JazzCash payment failed');
  }
};

// Easypaisa Handler
export const processEasypaisaPayment = async (
  phoneNumber: string,
  amount: number,
  orderDetails: any
) => {
  const missingConfig =
    !paymentConfig.easypaisa.merchantId || !paymentConfig.easypaisa.password;
  if (shouldMock(missingConfig)) {
    console.warn('Mocking Easypaisa - backend/config not available');
    return mockPaymentResponse('easypaisa', orderDetails);
  }
  try {
    const response = await axios.post('/api/payments/easypaisa', {
      merchantId: paymentConfig.easypaisa.merchantId,
      password: paymentConfig.easypaisa.password,
      amount,
      transactionReference: orderDetails.orderNumber,
      customerPhoneNumber: phoneNumber,
      customerEmail: orderDetails.customerEmail,
      customerName: orderDetails.customerName,
      description: `Urban Wear Order - ${orderDetails.orderNumber}`,
      returnURL: `${window.location.origin}/order-confirmation`,
      notificationURL: `${window.location.origin}/api/payments/easypaisa/callback`,
    });
    return response.data;
  } catch (error) {
    console.error('Easypaisa payment error:', error);
    throw new Error('Easypaisa payment failed');
  }
};

// Visa Handler (using Stripe)
export const processVisaPayment = async (
  token: string,
  amount: number,
  orderDetails: any
) => {
  const missingConfig = !paymentConfig.stripePublicKey;
  if (shouldMock(missingConfig)) {
    console.warn('Mocking Visa (Stripe) - backend/config not available');
    return mockPaymentResponse('visa', orderDetails);
  }
  try {
    const response = await axios.post('/api/payments/visa', {
      token,
      amount,
      currency: paymentConfig.currency,
      cardNetwork: 'visa',
      description: `Urban Wear Order - ${orderDetails.orderNumber}`,
      metadata: {
        orderId: orderDetails.orderNumber,
        paymentMethod: 'VISA',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Visa payment error:', error);
    throw new Error('Visa payment failed');
  }
};

// Generic Cash on Delivery Handler
export const processCashOnDeliveryPayment = async (orderDetails: any) => {
  try {
    return {
      success: true,
      status: 'pending',
      message: 'Order confirmed. Payment will be collected on delivery.',
      orderId: orderDetails.orderNumber,
      paymentMethod: 'COD',
      expectedDelivery: orderDetails.expectedDelivery,
    };
  } catch (error) {
    console.error('COD payment error:', error);
    throw new Error('COD processing failed');
  }
};

// Process Payment by Gateway Type
export const processPayment = async (
  paymentMethod: string,
  paymentData: any,
  amount: number,
  orderDetails: any
) => {
  switch (paymentMethod) {
    case PAYMENT_GATEWAYS.COD:
      return processCashOnDeliveryPayment(orderDetails);
    case PAYMENT_GATEWAYS.STRIPE:
      return processStripePayment(paymentData.token, amount, orderDetails);
    case PAYMENT_GATEWAYS.GOOGLE_PAY:
      return processGooglePayPayment(paymentData.token, amount, orderDetails);
    case PAYMENT_GATEWAYS.JAZZ_CASH:
      return processJazzCashPayment(paymentData.phoneNumber, amount, orderDetails);
    case PAYMENT_GATEWAYS.EASYPAISA:
      return processEasypaisaPayment(paymentData.phoneNumber, amount, orderDetails);
    case PAYMENT_GATEWAYS.VISA:
      return processVisaPayment(paymentData.token, amount, orderDetails);
    default:
      throw new Error('Invalid payment method');
  }
};
