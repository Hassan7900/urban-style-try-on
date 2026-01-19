# Payment Gateway Integration Guide

This document explains how to set up and use the payment gateways integrated into the Urban Wear application.

## Supported Payment Methods

1. **Cash on Delivery (COD)** - Free, no setup required
2. **Stripe** - Credit/Debit cards and Visa
3. **Google Pay** - Fast and secure
4. **JazzCash** - Pakistan mobile payment
5. **Easypaisa** - Pakistan fast payment
6. **Visa** - Direct Visa card payment

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your payment gateway credentials:

```bash
cp .env.example .env.local
```

### 2. Stripe Setup

1. Create an account at [stripe.com](https://stripe.com)
2. Get your **Publishable Key** from the API keys section
3. Add to `.env.local`:
```
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
```

4. Install Stripe in your backend:
```bash
npm install stripe
```

### 3. Google Pay Setup

1. Go to [Google Pay Business Console](https://pay.google.com/business/console)
2. Create a project and get your **Client ID**
3. Add to `.env.local`:
```
VITE_GOOGLE_PAY_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### 4. JazzCash Setup

1. Register at [JazzCash](https://www.jazzcash.com.pk/)
2. Get your **Merchant ID** and **Password**
3. Add to `.env.local`:
```
VITE_JAZZ_CASH_MERCHANT_ID=your_merchant_id
VITE_JAZZ_CASH_PASSWORD=your_password
```

### 5. Easypaisa Setup

1. Register at [Easypaisa](https://www.easypaisa.com.pk/)
2. Get your **Merchant ID** and **Password**
3. Add to `.env.local`:
```
VITE_EASYPAISA_MERCHANT_ID=your_merchant_id
VITE_EASYPAISA_PASSWORD=your_password
```

## Project Structure

### New Files Created

```
src/
├── config/
│   └── paymentConfig.ts          # Payment gateway configuration
├── utils/
│   └── paymentProcessing.ts      # Payment processing logic
├── components/
│   └── PaymentMethodSelector.tsx # Payment method UI component
└── pages/
    └── Checkout.tsx             # Complete checkout page
```

## Key Components

### 1. Payment Configuration (`src/config/paymentConfig.ts`)

Defines all payment gateway configurations and loads credentials from environment variables.

```typescript
export const PAYMENT_GATEWAYS = {
  COD: 'cod',
  STRIPE: 'stripe',
  GOOGLE_PAY: 'google_pay',
  JAZZ_CASH: 'jazz_cash',
  EASYPAISA: 'easypaisa',
  VISA: 'visa',
};
```

### 2. Payment Processing (`src/utils/paymentProcessing.ts`)

Contains payment processing functions for each gateway:

```typescript
// Process payment by gateway type
await processPayment(paymentMethod, paymentData, amount, orderDetails);
```

### 3. Payment Method Selector Component

Radio-based UI component for selecting payment methods.

```typescript
<PaymentMethodSelector
  selectedMethod={selectedPayment}
  onMethodChange={setSelectedPayment}
/>
```

### 4. Checkout Page

Complete checkout flow with:
- Shipping information form
- Payment method selection
- Order summary
- Payment processing

## API Endpoints

You'll need to create these backend endpoints:

### POST `/api/payments/stripe`
Process Stripe card payments

**Request:**
```json
{
  "token": "stripe_token",
  "amount": 7000,
  "currency": "PKR",
  "description": "Order details"
}
```

### POST `/api/payments/google-pay`
Process Google Pay payments

### POST `/api/payments/jazz-cash`
Process JazzCash payments

**Request:**
```json
{
  "merchantId": "merchant_id",
  "password": "password",
  "ppAmount": 7000,
  "ppBillReference": "URB-123456",
  "phoneNumber": "+92300123456"
}
```

### POST `/api/payments/easypaisa`
Process Easypaisa payments

### POST `/api/payments/visa`
Process Visa card payments

### POST `/api/payments/jazz-cash/callback`
JazzCash callback endpoint

### POST `/api/payments/easypaisa/callback`
Easypaisa callback endpoint

## Frontend Implementation

### Using the Checkout Page

The checkout page is automatically linked from the Cart page:

```
Cart (/cart) 
  └─> Checkout (/checkout)
    └─> Order Confirmation (/order-confirmation)
```

### Payment Flow

1. User adds items to cart
2. User clicks "Proceed to Checkout"
3. User fills shipping information
4. User selects payment method
5. User confirms payment
6. Payment is processed
7. Order confirmation page is shown

## Testing

### Stripe Test Cards

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
```

### Testing Each Gateway

1. **COD**: No payment required, order is placed immediately
2. **Stripe**: Use test card numbers above
3. **Google Pay**: Use test account
4. **JazzCash**: Use merchant test environment
5. **Easypaisa**: Use merchant test environment
6. **Visa**: Use Stripe test cards (Visa)

## Security Considerations

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use HTTPS** in production
3. **Validate all payments** on the backend
4. **Store sensitive data** securely
5. **Implement proper authentication** for payment endpoints
6. **Use Stripe's PCI compliance** - don't store raw card data
7. **Implement rate limiting** on payment endpoints
8. **Log all payment attempts** for auditing

## Error Handling

The payment processing includes error handling for each gateway:

```typescript
try {
  const result = await processPayment(...);
} catch (error) {
  toast.error(error.message);
}
```

## Webhooks and Callbacks

Implement webhook handlers for:

1. **JazzCash**: `/api/payments/jazz-cash/callback`
2. **Easypaisa**: `/api/payments/easypaisa/callback`
3. **Stripe**: Use Stripe webhooks via webhook endpoint

## Dependencies Added

```json
{
  "@stripe/react-stripe-js": "^2.8.0",
  "@stripe/stripe-js": "^3.5.0",
  "axios": "^1.7.5"
}
```

Install with:
```bash
npm install
```

## Troubleshooting

### Issue: Payment gateway credentials not loading

**Solution**: Verify `.env.local` file exists and has correct values.

### Issue: Stripe payments failing

**Solution**: 
- Check your Stripe Public Key
- Ensure backend has Stripe secret key
- Verify currency is set to PKR

### Issue: JazzCash/Easypaisa redirects not working

**Solution**:
- Verify merchant credentials
- Check callback URLs in environment
- Ensure merchant account is active

## Next Steps

1. Set up backend payment processing endpoints
2. Configure webhook handlers for async payments
3. Implement order status tracking
4. Add payment receipt generation
5. Set up email notifications
6. Implement refund processing
7. Add payment history to user dashboard

## Support

For payment gateway support:
- Stripe: https://support.stripe.com
- Google Pay: https://developers.google.com/pay
- JazzCash: https://www.jazzcash.com.pk/
- Easypaisa: https://www.easypaisa.com.pk/

## References

- [Stripe Documentation](https://stripe.com/docs)
- [Google Pay Documentation](https://developers.google.com/pay/api)
- [JazzCash Integration Guide](https://www.jazzcash.com.pk/business)
- [Easypaisa Integration Guide](https://www.easypaisa.com.pk/)
