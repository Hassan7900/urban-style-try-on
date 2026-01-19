# Payment Gateway Integration - Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     URBAN WEAR APPLICATION                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐           ┌──────────────────┐               │
│  │  Shopping Cart   │           │  Product Browse  │               │
│  └────────┬─────────┘           └────────┬─────────┘               │
│           │                               │                        │
│           └───────────────┬───────────────┘                        │
│                           ▼                                        │
│                    [Proceed to]                                    │
│                    [Checkout]                                      │
│                           │                                        │
│           ┌───────────────▼───────────────┐                        │
│           │  CHECKOUT PAGE (Checkout.tsx) │                        │
│           ├───────────────────────────────┤                        │
│           │ 1. Shipping Information Form  │                        │
│           │ 2. Payment Method Selection   │                        │
│           │ 3. Order Summary              │                        │
│           │ 4. Submit Button              │                        │
│           └────────────┬──────────────────┘                        │
│                        │                                           │
│      ┌─────────────────┼─────────────────┬─────────────┐          │
│      ▼                 ▼                 ▼             ▼          │
│  [COD]           [Stripe/Visa]      [Google Pay]  [JazzCash/   │
│                                                    Easypaisa]    │
│                                                                   │
│  ┌────────┐  ┌────────────────┐  ┌──────────┐  ┌───────────┐   │
│  │Payment │  │Payment         │  │Google    │  │JazzCash   │   │
│  │Config  │  │Processing      │  │Pay API   │  │Easypaisa  │   │
│  │        │  │(Utilities)     │  │          │  │API        │   │
│  │env:    │  │                │  │          │  │           │   │
│  │Keys    │  │processPayment()│  │          │  │           │   │
│  │Creds   │  │handleStripe()  │  │          │  │           │   │
│  │        │  │handleGoogle()  │  │          │  │           │   │
│  │        │  │handleJC()      │  │          │  │           │   │
│  │        │  │handleEP()      │  │          │  │           │   │
│  └────────┘  └────────────────┘  └──────────┘  └───────────┘   │
│       │                │                │            │          │
│       └────────────────┼────────────────┼────────────┘          │
│                        ▼                                        │
│              ┌──────────────────────┐                            │
│              │  BACKEND API LAYER   │                            │
│              ├──────────────────────┤                            │
│              │ /api/payments/*      │                            │
│              │ - stripe             │                            │
│              │ - google-pay         │                            │
│              │ - jazz-cash          │                            │
│              │ - easypaisa          │                            │
│              │ - visa               │                            │
│              │ - callbacks          │                            │
│              └──────────────────────┘                            │
│                        │                                        │
│      ┌─────────────────┼─────────────────┬─────────────┐       │
│      ▼                 ▼                 ▼             ▼       │
│  [Stripe]         [Google]          [JazzCash]   [Easypaisa]  │
│  Servers          Pay                Servers      Servers     │
│                   Servers                                      │
│                                                                │
│           ┌───────────────────────────────────────┐            │
│           │ ORDER CONFIRMATION PAGE               │            │
│           │ (Order Confirmation.tsx)              │            │
│           ├───────────────────────────────────────┤            │
│           │ ✓ Order Placed Successfully           │            │
│           │ - Order Number                        │            │
│           │ - Items Purchased                     │            │
│           │ - Total Amount                        │            │
│           │ - Delivery Status                     │            │
│           │ - Tracking Info                       │            │
│           └───────────────────────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App (App.tsx)
├── Route: /checkout
│   └── Checkout Page (Checkout.tsx)
│       ├── Header
│       ├── Main Content (2-column layout)
│       │   ├── Column 1: Form (lg:col-span-2)
│       │   │   ├── Card: Shipping Information
│       │   │   │   ├── Full Name Input
│       │   │   │   ├── Email Input
│       │   │   │   ├── Phone Input
│       │   │   │   ├── Address Input
│       │   │   │   ├── City Input
│       │   │   │   └── Postal Code Input
│       │   │   │
│       │   │   ├── Payment Methods Divider
│       │   │   └── PaymentMethodSelector Component
│       │   │       ├── COD Option
│       │   │       ├── Stripe Option
│       │   │       ├── Google Pay Option
│       │   │       ├── JazzCash Option
│       │   │       ├── Easypaisa Option
│       │   │       └── Visa Option
│       │   │
│       │   ├── Conditional Card Details
│       │   │   ├── Card Number Input
│       │   │   ├── Expiry Date Input
│       │   │   └── CVC Input
│       │   │
│       │   └── Submit Button
│       │
│       └── Column 2: Sidebar (lg:col-span-1)
│           └── Card: Order Summary (sticky)
│               ├── Items List
│               ├── Subtotal
│               ├── Delivery Fee
│               ├── Total
│               └── Free Delivery Badge (conditional)
│
└── Footer
```

## Payment Flow Diagram

```
START: Shopping Cart with Items
    │
    └─► [Click "Proceed to Checkout"]
        │
        ▼
    CHECKOUT PAGE
    ├─ Form Initialization
    │  ├─ Load user data (email, etc.)
    │  └─ Set default values
    │
    ├─ User Actions
    │  ├─ Fill Shipping Info
    │  ├─ Select Payment Method
    │  └─ (Optional) Enter Card Details
    │
    ├─ Form Validation
    │  ├─ Check required fields
    │  ├─ Validate email format
    │  ├─ Validate phone format
    │  └─ Validate payment method selected
    │
    └─► [Click "Place Order"]
        │
        ▼
    PAYMENT PROCESSING
    │
    ├─► If COD Selected
    │   └─► processCashOnDeliveryPayment()
    │       └─► Immediate Confirmation
    │
    ├─► If Stripe/Visa Selected
    │   └─► processStripePayment()
    │       └─► POST /api/payments/stripe
    │           └─► Stripe API
    │               └─► Payment Processing
    │
    ├─► If Google Pay Selected
    │   └─► processGooglePayPayment()
    │       └─► POST /api/payments/google-pay
    │           └─► Google Pay API
    │               └─► Payment Processing
    │
    ├─► If JazzCash Selected
    │   └─► processJazzCashPayment()
    │       └─► POST /api/payments/jazz-cash
    │           └─► JazzCash API
    │               └─► User Redirected for Payment
    │                   └─► JazzCash Callback
    │                       └─► /api/payments/jazz-cash/callback
    │                           └─► Order Status Updated
    │
    └─► If Easypaisa Selected
        └─► processEasypaisaPayment()
            └─► POST /api/payments/easypaisa
                └─► Easypaisa API
                    └─► User Redirected for Payment
                        └─► Easypaisa Callback
                            └─► /api/payments/easypaisa/callback
                                └─► Order Status Updated
    │
    ▼
ERROR?
├─► YES: Show Toast Error
│   └─► Stay on Checkout Page
│       └─► Allow Retry
│
└─► NO: Clear Cart
    └─► Navigate to Order Confirmation
        │
        ▼
    ORDER CONFIRMATION PAGE
    ├─ Display Success Message
    ├─ Show Order Number
    ├─ Display Items Purchased
    ├─ Show Total Amount
    ├─ Display Delivery Info
    └─► Auto-redirect to Shipping (5s)
        │
        ▼
    SHIPPING TRACKING PAGE
    └─► Track Order Status
```

## File Structure with Dependencies

```
src/
├── config/
│   └── paymentConfig.ts
│       ├── EXPORTS: PAYMENT_GATEWAYS, PaymentGateway, PaymentConfig
│       ├── IMPORTS: import.meta.env
│       └── USED BY: paymentProcessing.ts, PaymentMethodSelector.tsx, Checkout.tsx
│
├── utils/
│   └── paymentProcessing.ts
│       ├── EXPORTS: processPayment(), processStripePayment(), etc.
│       ├── IMPORTS: axios, paymentConfig
│       └── USED BY: Checkout.tsx
│
├── components/
│   └── PaymentMethodSelector.tsx
│       ├── EXPORTS: PaymentMethodSelector component
│       ├── IMPORTS: Card, Radio, PAYMENT_METHOD_DETAILS
│       ├── PROPS: selectedMethod, onMethodChange
│       └── USED BY: Checkout.tsx
│
└── pages/
    └── Checkout.tsx
        ├── IMPORTS: 
        │   ├─ PaymentMethodSelector
        │   ├─ paymentProcessing utilities
        │   ├─ paymentConfig constants
        │   ├─ UI components (Button, Card, Form, Input)
        │   ├─ useCart context
        │   ├─ useAuth context
        │   └─ react-hook-form + zod
        │
        ├── EXPORTS: Checkout component
        │
        ├── FUNCTIONS:
        │   ├─ onSubmit(data) - Form submission handler
        │   ├─ useEffect - Redirect if no items/user
        │   └─ Calculation: deliveryFee, finalTotal
        │
        └── USED BY: App.tsx (Route /checkout)
```

## Data Flow Diagram

```
┌─────────────────────┐
│  Component State    │
│  ─────────────────  │
│  selectedPayment    │
│  isProcessing       │
│  orderNumber        │
│  items (from Cart)  │
│  totalPrice (from)  │
│  Cart               │
│  user (from Auth)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  useForm Hook (React Hook Form)         │
│  ─────────────────────────────────────  │
│  fullName                               │
│  email                                  │
│  phone                                  │
│  address                                │
│  city                                   │
│  postalCode                             │
│  cardNumber (conditional)               │
│  cardExpiry (conditional)               │
│  cardCvc (conditional)                  │
└──────────┬──────────────────────────────┘
           │
           ▼
┌──────────────────────────┐
│  Form Validation (Zod)   │
│  ─────────────────────── │
│  - Required field checks │
│  - Format validation     │
│  - Email validation      │
│  - Phone validation      │
│  - Address validation    │
└──────────┬───────────────┘
           │
           ▼ (onSubmit triggered)
┌────────────────────────────────────────────┐
│  Build Order Details Object                │
│  ─────────────────────────────────────────│
│  {                                         │
│    orderNumber: "URB-123456"               │
│    customerName: string                    │
│    customerEmail: string                   │
│    customerPhone: string                   │
│    address: string                         │
│    city: string                            │
│    items: CartItem[]                       │
│    subtotal: number                        │
│    deliveryFee: number                     │
│    total: number                           │
│  }                                         │
└──────────┬───────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  Build Payment Data (Gateway-Specific)     │
│  ─────────────────────────────────────────│
│  COD:       {}                             │
│  Stripe:    { token: "stripe_token" }     │
│  Google:    { token: "google_token" }     │
│  JazzCash:  { phoneNumber: string }       │
│  Easypaisa: { phoneNumber: string }       │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  processPayment(method, data, amount, details)   │
│  (from paymentProcessing.ts)                     │
│  ───────────────────────────────────────────────│
│  Based on method, calls appropriate handler:    │
│  ├─ processCashOnDeliveryPayment()               │
│  ├─ processStripePayment()                       │
│  ├─ processGooglePayPayment()                    │
│  ├─ processJazzCashPayment()                     │
│  ├─ processEasypaisaPayment()                    │
│  └─ processVisaPayment()                         │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  Backend API Call (via axios)                    │
│  ───────────────────────────────────────────────│
│  POST /api/payments/{method}                     │
│  ├─ Request Body: payment data + order details   │
│  └─ Response: { success, status, ... }           │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Payment Gateway Response         │
│  ──────────────────────────────── │
│  COD:       { success: true }     │
│  Stripe:    { success: true }     │
│  Google:    { success: true }     │
│  JazzCash:  { redirectURL: ... }  │
│  Easypaisa: { redirectURL: ... }  │
└──────────┬──────────────────────┘
           │
      ┌────┴────┐
      │          │
      ▼          ▼
  SUCCESS    ERROR
      │          │
      ▼          ▼
┌─────────┐  ┌──────────────┐
│ Clear   │  │ Show Toast   │
│ Cart    │  │ Error        │
│         │  │              │
│ Store   │  │ Stay on Page │
│ Order   │  │              │
│ to      │  │ Allow Retry  │
│ Local   │  └──────────────┘
│ Storage │
│         │
│ Redirect│
│ to      │
│ Order   │
│ Confirm │
└─────────┘
```

## State Management Flow

```
App Context
├── AuthContext (useAuth)
│   └── user (email, user_metadata)
│
├── CartContext (useCart)
│   ├── items []
│   ├── totalPrice number
│   ├── removeFromCart()
│   ├── updateQuantity()
│   └── clearCart()
│
└── ThemeContext
    └── theme management

Checkout Component Local State
├── selectedPayment (PaymentGateway | "")
├── isProcessing (boolean)
└── orderNumber (string)

Form State (React Hook Form)
├── fullName
├── email
├── phone
├── address
├── city
├── postalCode
└── card* (conditional)
```

## UI Component Hierarchy

```
Checkout (Page)
│
├── Helmet (SEO)
├── Header
│
├── Main Container
│   │
│   ├── Page Title & Back Button
│   │
│   └── Grid (lg:grid-cols-3 gap-12)
│       │
│       ├── Left Column (lg:col-span-2)
│       │   │
│       │   └── Card: Shipping Information
│       │       │
│       │       └── Form
│       │           ├── Row 1
│       │           │   ├── Name Input
│       │           │   └── Email Input
│       │           │
│       │           ├── Row 2
│       │           │   ├── Phone Input
│       │           │   └── City Input
│       │           │
│       │           ├── Address Input
│       │           │
│       │           ├── Postal Code Input
│       │           │
│       │           ├── Payment Methods Border
│       │           │
│       │           ├── PaymentMethodSelector
│       │           │   └── RadioGroup
│       │           │       ├── COD Card
│       │           │       ├── Stripe Card
│       │           │       ├── Google Pay Card
│       │           │       ├── JazzCash Card
│       │           │       ├── Easypaisa Card
│       │           │       └── Visa Card
│       │           │
│       │           ├── (Conditional) Card Details
│       │           │   ├── Card Number Input
│       │           │   ├── Expiry Input
│       │           │   └── CVC Input
│       │           │
│       │           └── Submit Button (full width)
│       │
│       └── Right Column (lg:col-span-1)
│           │
│           └── Card: Order Summary (sticky)
│               ├── Title
│               │
│               ├── Items List (scrollable)
│               │   └── Item (repeating)
│               │       ├── Image
│               │       ├── Name
│               │       ├── Size & Color
│               │       ├── Qty
│               │       └── Price
│               │
│               ├── Divider
│               │
│               ├── Subtotal Row
│               ├── Delivery Row
│               ├── Total Row
│               │
│               ├── (Conditional) Free Delivery Badge
│               │
│               └── Order Info
│                   ├── Order Number
│                   └── Est. Delivery
│
├── Footer
│
└── Sonner Toast Notifications
    ├── Success Message
    └── Error Message
```

## Security & Best Practices Diagram

```
┌────────────────────────────────────────────────┐
│     SECURITY LAYERS                            │
├────────────────────────────────────────────────┤
│                                                │
│ LAYER 1: Environment Variables                │
│ ────────────────────────────────              │
│ ├─ .env.local (NOT in git)                    │
│ ├─ import.meta.env in config                  │
│ └─ No secrets in code                         │
│                                                │
│ LAYER 2: Frontend Validation                  │
│ ────────────────────────────────              │
│ ├─ Zod schema validation                      │
│ ├─ Form field validation                      │
│ ├─ Error handling                             │
│ └─ User feedback                              │
│                                                │
│ LAYER 3: API Layer                            │
│ ────────────────────────────────              │
│ ├─ HTTPS only                                 │
│ ├─ CORS configuration                         │
│ ├─ Rate limiting                              │
│ └─ Request validation                         │
│                                                │
│ LAYER 4: Payment Gateway                      │
│ ────────────────────────────────              │
│ ├─ Tokenization (Stripe)                      │
│ ├─ Encryption                                 │
│ ├─ PCI DSS Compliance                         │
│ └─ Webhook signature verification             │
│                                                │
│ LAYER 5: Backend Processing                   │
│ ────────────────────────────────              │
│ ├─ Server-side validation                     │
│ ├─ Secure API keys                            │
│ ├─ Transaction logging                        │
│ ├─ Error handling                             │
│ └─ Audit trail                                │
│                                                │
│ LAYER 6: Database                             │
│ ────────────────────────────────              │
│ ├─ Encrypted sensitive data                   │
│ ├─ Access controls                            │
│ ├─ Data isolation                             │
│ └─ Backup & recovery                          │
│                                                │
└────────────────────────────────────────────────┘
```

---

This visual guide helps understand the complete payment gateway integration architecture and data flow through the application.
