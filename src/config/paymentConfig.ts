// Payment Gateway Configuration
export const PAYMENT_GATEWAYS = {
  COD: 'cod',
  STRIPE: 'stripe',
  GOOGLE_PAY: 'google_pay',
  JAZZ_CASH: 'jazz_cash',
  EASYPAISA: 'easypaisa',
  VISA: 'visa',
} as const;

export type PaymentGateway = typeof PAYMENT_GATEWAYS[keyof typeof PAYMENT_GATEWAYS];

export interface PaymentConfig {
  stripePublicKey: string;
  googlePayClientId: string;
  jazzCashMerchantId: string;
  jazzCashPassword: string;
  easypaisa: {
    merchantId: string;
    password: string;
  };
  currency: string;
  locale: string;
}

// Load payment config from environment variables
export const paymentConfig: PaymentConfig = {
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  googlePayClientId: import.meta.env.VITE_GOOGLE_PAY_CLIENT_ID || '',
  jazzCashMerchantId: import.meta.env.VITE_JAZZ_CASH_MERCHANT_ID || '',
  jazzCashPassword: import.meta.env.VITE_JAZZ_CASH_PASSWORD || '',
  easypaisa: {
    merchantId: import.meta.env.VITE_EASYPAISA_MERCHANT_ID || '',
    password: import.meta.env.VITE_EASYPAISA_PASSWORD || '',
  },
  currency: 'PKR',
  locale: 'en-PK',
};

export const PAYMENT_METHOD_DETAILS = {
  [PAYMENT_GATEWAYS.COD]: {
    id: PAYMENT_GATEWAYS.COD,
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: '🏠',
    enabled: true,
  },
  [PAYMENT_GATEWAYS.STRIPE]: {
    id: PAYMENT_GATEWAYS.STRIPE,
    name: 'Credit/Debit Card (Stripe)',
    description: 'Visa, Mastercard, and more',
    icon: '💳',
    enabled: true,
  },
  [PAYMENT_GATEWAYS.GOOGLE_PAY]: {
    id: PAYMENT_GATEWAYS.GOOGLE_PAY,
    name: 'Google Pay',
    description: 'Fast and secure',
    icon: '🅶',
    enabled: true,
  },
  [PAYMENT_GATEWAYS.JAZZ_CASH]: {
    id: PAYMENT_GATEWAYS.JAZZ_CASH,
    name: 'JazzCash',
    description: 'Pakistan mobile payment',
    icon: '📱',
    enabled: true,
  },
  [PAYMENT_GATEWAYS.EASYPAISA]: {
    id: PAYMENT_GATEWAYS.EASYPAISA,
    name: 'Easypaisa',
    description: 'Fast and secure payment',
    icon: '💰',
    enabled: true,
  },
  [PAYMENT_GATEWAYS.VISA]: {
    id: PAYMENT_GATEWAYS.VISA,
    name: 'Visa',
    description: 'Visa card payment',
    icon: '🔵',
    enabled: true,
  },
} as const;
