# Payment Gateway Integration - Deployment Guide

## Pre-Deployment Checklist

### Frontend
- [ ] All payment components created and tested
- [ ] Environment variables configured
- [ ] Payment processing utilities functional
- [ ] Checkout page styling complete
- [ ] Form validation working
- [ ] Error handling implemented
- [ ] Toast notifications displaying
- [ ] Mobile responsive design verified

### Backend
- [ ] Payment endpoints created
- [ ] Stripe integration configured
- [ ] Google Pay integration configured
- [ ] JazzCash integration configured
- [ ] Easypaisa integration configured
- [ ] Webhook handlers implemented
- [ ] Database models created for orders
- [ ] Error handling and logging setup
- [ ] Rate limiting configured
- [ ] CORS configured for payment domains

### Payment Gateways
- [ ] Stripe account created and verified
- [ ] Stripe API keys obtained
- [ ] Google Pay merchant account setup
- [ ] JazzCash merchant account setup
- [ ] Easypaisa merchant account setup
- [ ] Webhook URLs configured
- [ ] Test mode credentials obtained
- [ ] Production credentials obtained

### Security
- [ ] `.env.local` created with credentials
- [ ] `.env.local` added to `.gitignore`
- [ ] HTTPS configured
- [ ] API authentication implemented
- [ ] Rate limiting tested
- [ ] CORS properly configured
- [ ] Webhook signature verification implemented
- [ ] Error messages sanitized
- [ ] Sensitive data logging disabled

### Testing
- [ ] COD payment tested
- [ ] Stripe test card payments successful
- [ ] Google Pay integration tested
- [ ] JazzCash sandbox tested
- [ ] Easypaisa sandbox tested
- [ ] Webhook callbacks tested
- [ ] Error scenarios tested
- [ ] Mobile payment flows tested
- [ ] Edge cases handled

## Deployment Steps

### Step 1: Install Dependencies

```bash
cd urban-style-try-on
npm install
```

This will install:
- `@stripe/react-stripe-js` - React Stripe library
- `@stripe/stripe-js` - Stripe.js SDK
- `axios` - HTTP client for API calls

### Step 2: Create Environment Files

Create `.env.local` in the root directory:

```bash
# Copy from template
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local  # or use your preferred editor
```

Fill in all payment gateway credentials:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
VITE_GOOGLE_PAY_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_JAZZ_CASH_MERCHANT_ID=your_merchant_id
VITE_JAZZ_CASH_PASSWORD=your_password
VITE_EASYPAISA_MERCHANT_ID=your_merchant_id
VITE_EASYPAISA_PASSWORD=your_password
```

### Step 3: Build Frontend

```bash
# Development build with source maps
npm run build:dev

# Production build
npm run build

# Preview build locally
npm run preview
```

### Step 4: Deploy Backend Endpoints

Create Node.js/Express backend endpoints based on `BACKEND_PAYMENT_EXAMPLES.js`:

```bash
# Copy example and create actual implementation
cp BACKEND_PAYMENT_EXAMPLES.js backend/routes/payments.js
```

Implement the following endpoints:
- `POST /api/payments/stripe`
- `POST /api/payments/google-pay`
- `POST /api/payments/jazz-cash`
- `POST /api/payments/easypaisa`
- `POST /api/payments/visa`
- `POST /api/payments/jazz-cash/callback`
- `POST /api/payments/easypaisa/callback`

### Step 5: Configure Payment Gateways

#### Stripe Configuration

```javascript
// In backend
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Set webhook endpoint
// https://your-domain.com/api/webhooks/stripe
```

#### JazzCash Configuration

```javascript
// Use appropriate endpoints
const sandbox = 'https://sandbox.jazzcash.com.pk/';
const production = 'https://www.jazzcash.com.pk/';
```

#### Easypaisa Configuration

```javascript
// Use appropriate endpoints
const sandbox = 'https://sandbox.easypaisa.com.pk/';
const production = 'https://www.easypaisa.com.pk/';
```

### Step 6: Set Up Webhooks

#### Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `charge.succeeded`
   - `charge.failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

#### JazzCash Callbacks

Configure in JazzCash merchant portal:
- Notification URL: `https://your-domain.com/api/payments/jazz-cash/callback`
- Return URL: `https://your-domain.com/order-confirmation`

#### Easypaisa Callbacks

Configure in Easypaisa merchant portal:
- Notification URL: `https://your-domain.com/api/payments/easypaisa/callback`
- Return URL: `https://your-domain.com/order-confirmation`

### Step 7: Database Setup

Create database tables for order management:

```sql
-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  total_amount INTEGER NOT NULL,
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment transactions table
CREATE TABLE payment_transactions (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  gateway VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  response JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 8: Configure HTTPS

```bash
# Generate SSL certificate (using Let's Encrypt)
certbot certonly --standalone -d your-domain.com

# Configure in nginx/apache
# See nginx.conf for HTTPS configuration example
```

### Step 9: Environment-Specific Configuration

#### Development Environment

```env
NODE_ENV=development
VITE_STRIPE_PUBLIC_KEY=pk_test_...
API_URL=http://localhost:3000
```

#### Production Environment

```env
NODE_ENV=production
VITE_STRIPE_PUBLIC_KEY=pk_live_...
API_URL=https://api.your-domain.com
LOG_LEVEL=error
```

### Step 10: Testing in Production

1. **Test with Small Amount**
   ```
   Amount: Rs. 100
   Card: Test card (if applicable)
   ```

2. **Test Error Scenarios**
   - Declined payment
   - Timeout
   - Network error
   - Invalid credentials

3. **Test Webhooks**
   - Verify callbacks are received
   - Check order status updates
   - Verify email notifications

4. **Load Testing**
   - Simulate multiple concurrent payments
   - Verify rate limiting
   - Check API response times

### Step 11: Monitoring & Logging

Set up monitoring for:

```javascript
// Log payment transactions
logger.info('Payment processed', {
  orderId,
  method,
  amount,
  status,
  timestamp: new Date(),
});

// Monitor API health
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    payments: 'operational'
  });
});
```

### Step 12: Backup & Recovery

```bash
# Backup environment variables
cp .env.local .env.local.backup

# Backup database
pg_dump your_database > backup.sql

# Backup payment logs
tar -czf payment_logs.tar.gz logs/
```

## Docker Deployment

### Build Docker Image

```dockerfile
# Dockerfile already exists in project
docker build -t urban-wear:latest .
```

### Run Container

```bash
docker-compose up -d
```

### Environment Variables in Docker

```yaml
# docker-compose.yml
environment:
  VITE_STRIPE_PUBLIC_KEY: ${STRIPE_PUBLIC_KEY}
  VITE_JAZZ_CASH_MERCHANT_ID: ${JAZZ_CASH_MERCHANT_ID}
  # ... other variables
```

## SSL/TLS Configuration

### Nginx Configuration

```nginx
# See nginx.conf in project root
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

## Performance Optimization

### Caching Strategy

```javascript
// Cache payment method list
app.get('/api/payments/methods', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json(paymentMethods);
});
```

### Database Indexing

```sql
-- Index frequently queried fields
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_transactions_order_id ON payment_transactions(order_id);
```

## Post-Deployment

### 1. Verify All Endpoints

```bash
curl -X POST http://localhost:3000/api/payments/stripe \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "token": "test_token"}'
```

### 2. Check Payment Gateway Status

- Stripe Dashboard: https://dashboard.stripe.com
- JazzCash: Merchant portal
- Easypaisa: Merchant portal
- Google Pay: Merchant console

### 3. Monitor Logs

```bash
# Watch application logs
tail -f logs/app.log

# Watch payment logs
tail -f logs/payments.log

# Watch error logs
tail -f logs/errors.log
```

### 4. Set Up Alerts

```javascript
// Alert on failed payments
if (paymentStatus === 'FAILED') {
  sendAlert('Payment Failed', {
    orderId,
    amount,
    gateway,
    error
  });
}
```

## Rollback Plan

If deployment fails:

1. Revert code changes
   ```bash
   git revert <commit-hash>
   ```

2. Restore database backup
   ```bash
   psql your_database < backup.sql
   ```

3. Restore environment variables
   ```bash
   cp .env.local.backup .env.local
   ```

4. Redeploy
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## Maintenance Schedule

- **Daily**: Monitor payment logs and alerts
- **Weekly**: Review failed transactions and customer support tickets
- **Monthly**: Analyze payment trends and performance metrics
- **Quarterly**: Security audit and compliance check
- **Annually**: Payment gateway agreement review and renewal

## Support & Escalation

### Payment Gateway Support Contacts

- **Stripe**: https://support.stripe.com (24/7)
- **Google Pay**: https://developers.google.com/pay/support
- **JazzCash**: https://www.jazzcash.com.pk/contact
- **Easypaisa**: https://www.easypaisa.com.pk/contact

### Internal Support

- Create deployment checklist (copy this file)
- Document all API credentials (securely)
- Set up on-call rotation for payment issues
- Create incident response playbook

## Success Criteria

- ✅ All payment methods functional
- ✅ Zero transaction failures (except user-initiated cancellations)
- ✅ Sub-100ms API response times
- ✅ 99.9% uptime
- ✅ All webhooks received and processed
- ✅ Customer satisfaction > 95%
- ✅ No security incidents
- ✅ Compliance requirements met

---

**Deployment Date**: [Today's Date]
**Environment**: Production
**Status**: Ready for Launch

For questions or issues, refer to:
- PAYMENT_INTEGRATION_GUIDE.md
- BACKEND_PAYMENT_EXAMPLES.js
- BACKEND_PAYMENT_QUICK_REFERENCE.md
- PAYMENT_VISUAL_GUIDE.md
