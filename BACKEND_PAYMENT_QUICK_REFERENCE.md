# Payment Gateway Quick Reference

## Quick Setup Checklist

- [ ] Copy `.env.example` to `.env.local`
- [ ] Add Stripe Public Key to `.env.local`
- [ ] Add Google Pay Client ID to `.env.local`
- [ ] Add JazzCash Merchant ID & Password to `.env.local`
- [ ] Add Easypaisa Merchant ID & Password to `.env.local`
- [ ] Run `npm install` to install dependencies
- [ ] Implement backend payment endpoints
- [ ] Test with demo data
- [ ] Deploy to production

## Payment Method Details

### 1. Cash on Delivery (COD)
```
Status: ✅ Ready
Setup: None required
Testing: Select and place order
Backend: No external API calls
Webhook: Not required
```

### 2. Stripe
```
Status: ✅ Integrated
Setup: Get Stripe Publishable Key
Testing: Card 4242 4242 4242 4242
Backend: /api/payments/stripe
Webhook: Stripe webhooks
```

### 3. Google Pay
```
Status: ✅ Integrated
Setup: Get Google Pay Client ID
Testing: Use test account
Backend: /api/payments/google-pay
Webhook: Not typically required
```

### 4. JazzCash
```
Status: ✅ Integrated
Setup: Get Merchant ID & Password
Testing: Use merchant sandbox
Backend: /api/payments/jazz-cash
Webhook: /api/payments/jazz-cash/callback
```

### 5. Easypaisa
```
Status: ✅ Integrated
Setup: Get Merchant ID & Password
Testing: Use merchant sandbox
Backend: /api/payments/easypaisa
Webhook: /api/payments/easypaisa/callback
```

### 6. Visa
```
Status: ✅ Integrated via Stripe
Setup: Get Stripe Publishable Key
Testing: Card 4242 4242 4242 4242
Backend: /api/payments/visa
Webhook: Stripe webhooks
```

## Project Structure

```
urban-style-try-on/
├── src/
│   ├── config/
│   │   └── paymentConfig.ts
│   ├── utils/
│   │   └── paymentProcessing.ts
│   ├── components/
│   │   └── PaymentMethodSelector.tsx
│   └── pages/
│       └── Checkout.tsx
├── .env.example
├── PAYMENT_INTEGRATION_GUIDE.md
├── PAYMENT_IMPLEMENTATION_SUMMARY.md
├── BACKEND_PAYMENT_EXAMPLES.js
└── BACKEND_PAYMENT_QUICK_REFERENCE.md
```

## Key Functions

### Payment Processing
```typescript
import { processPayment } from '@/utils/paymentProcessing';

// Process any payment method
await processPayment(
  paymentMethod,      // 'cod' | 'stripe' | 'google_pay' | 'jazz_cash' | 'easypaisa' | 'visa'
  paymentData,        // Gateway-specific data
  amount,             // Amount in PKR
  orderDetails        // Order information
);
```

### Payment Method Selector
```typescript
import PaymentMethodSelector from '@/components/PaymentMethodSelector';

<PaymentMethodSelector
  selectedMethod={paymentMethod}
  onMethodChange={handleMethodChange}
/>
```

## Environment Variables

```bash
# .env.local
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_GOOGLE_PAY_CLIENT_ID=...
VITE_JAZZ_CASH_MERCHANT_ID=...
VITE_JAZZ_CASH_PASSWORD=...
VITE_EASYPAISA_MERCHANT_ID=...
VITE_EASYPAISA_PASSWORD=...
```

## Dependencies

```json
{
  "@stripe/react-stripe-js": "^2.8.0",
  "@stripe/stripe-js": "^3.5.0",
  "axios": "^1.7.5"
}
```

## Routes

```
/cart                    → Shopping cart
/checkout               → Checkout page with payment
/order-confirmation     → Order confirmation
```

## Component Props

### PaymentMethodSelector
```typescript
interface PaymentMethodSelectorProps {
  selectedMethod: PaymentGateway | "";
  onMethodChange: (method: PaymentGateway) => void;
}
```

## Payment Gateway Constants

```typescript
export const PAYMENT_GATEWAYS = {
  COD: 'cod',
  STRIPE: 'stripe',
  GOOGLE_PAY: 'google_pay',
  JAZZ_CASH: 'jazz_cash',
  EASYPAISA: 'easypaisa',
  VISA: 'visa',
};

export type PaymentGateway = typeof PAYMENT_GATEWAYS[keyof typeof PAYMENT_GATEWAYS];
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payments/stripe` | Stripe card payment |
| POST | `/api/payments/google-pay` | Google Pay payment |
| POST | `/api/payments/jazz-cash` | JazzCash payment |
| POST | `/api/payments/easypaisa` | Easypaisa payment |
| POST | `/api/payments/visa` | Visa card payment |
| POST | `/api/payments/jazz-cash/callback` | JazzCash webhook |
| POST | `/api/payments/easypaisa/callback` | Easypaisa webhook |

## Test Card Numbers

| Card Type | Number | Expiry | CVC |
|-----------|--------|--------|-----|
| Visa | 4242 4242 4242 4242 | 12/25 | 123 |
| Mastercard | 5555 5555 5555 4444 | 12/25 | 123 |
| American Express | 3782 822463 10005 | 12/25 | 1234 |

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Payment methods not showing | Check .env.local credentials |
| Form validation failing | Ensure all required fields filled |
| Payment processing errors | Verify backend endpoint connectivity |
| Stripe key invalid | Check Stripe Public Key in .env.local |
| Gateway credentials not loaded | Verify environment variables are set |

## Security Checklist

- [ ] Never commit `.env.local` to git
- [ ] Use environment variables for all credentials
- [ ] Validate all payments on backend
- [ ] Implement rate limiting on endpoints
- [ ] Use HTTPS in production
- [ ] Verify webhook signatures
- [ ] Log all payment attempts
- [ ] Implement proper error handling

## Performance Tips

1. Lazy load payment components
2. Cache payment methods
3. Optimize form validation
4. Minimize API calls
5. Use async/await properly
6. Implement proper error boundaries

## Mobile Considerations

- ✅ Responsive design
- ✅ Touch-friendly inputs
- ✅ Mobile payment methods (Apple Pay, Google Pay)
- ✅ SMS OTP for verification
- ✅ Mobile-optimized forms

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Payment Flow Diagram

```
Cart Page
    ↓
[Proceed to Checkout]
    ↓
Checkout Page
    ├─ Fill Shipping Info
    ├─ Select Payment Method
    └─ Review Order
    ↓
[Submit Payment]
    ↓
Payment Processing
    ├─ COD: Immediate confirmation
    ├─ Stripe: Token → Backend
    ├─ Google Pay: Token → Backend
    ├─ JazzCash: Redirect to JazzCash
    └─ Easypaisa: Redirect to Easypaisa
    ↓
Order Confirmation Page
    ↓
[Order Placed Successfully]
```

## Useful Links

- [Stripe Documentation](https://stripe.com/docs)
- [Google Pay Developers](https://developers.google.com/pay)
- [JazzCash Business](https://www.jazzcash.com.pk/)
- [Easypaisa](https://www.easypaisa.com.pk/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

## Contact Support

For integration issues:
1. Check PAYMENT_INTEGRATION_GUIDE.md
2. Review BACKEND_PAYMENT_EXAMPLES.js
3. Check browser console for errors
4. Review payment gateway documentation
5. Contact development team

---

**Last Updated**: January 19, 2026
**Version**: 1.0
