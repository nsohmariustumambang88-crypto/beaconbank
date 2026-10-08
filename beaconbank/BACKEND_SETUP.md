# BeaconBank Backend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

#### Prerequisites
- PostgreSQL installed locally or access to a hosted PostgreSQL database

#### Local PostgreSQL Setup (Windows)

If PostgreSQL is not installed:
```bash
# Using Chocolatey (if installed)
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE beaconbank;
CREATE USER beaconbank_user WITH PASSWORD 'secure_password';
ALTER ROLE beaconbank_user SET client_encoding TO 'utf8';
ALTER ROLE beaconbank_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE beaconbank_user SET default_transaction_deferrable TO on;
ALTER ROLE beaconbank_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE beaconbank TO beaconbank_user;
\q
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Update `.env.local` with your database connection:
```
DATABASE_URL="postgresql://beaconbank_user:secure_password@localhost:5432/beaconbank"
JWT_SECRET="your_32_char_secret_key_here"
```

### 4. Run Prisma Migrations

Initialize Prisma:
```bash
npx prisma init
```

Create migration:
```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables based on `prisma/schema.prisma`
- Generate Prisma Client

### 5. View Database (Optional)

Open Prisma Studio:
```bash
npx prisma studio
```

---

## 📊 Database Schema Overview

### Core Models

#### User
- Authentication & profile management
- Account types: personal, business, premium
- KYC/AML verification status

#### Wallet
- Multi-currency account storage (USD, EUR, GBP, etc.)
- Balance tracking
- Account numbers and IBAN/SWIFT codes

#### Transaction
- All financial movements (deposits, withdrawals, transfers, refunds)
- Status tracking (pending, completed, failed)
- Full audit trail

#### Transfer
- Peer-to-peer money transfers
- Currency conversion support
- Settlement time tracking

#### Refund
- Automated refund processing
- Multiple refund types (full, partial, store credit, scheduled)
- Merchant integration

#### FundRecovery
- Fraud case management
- AI severity assessment
- Evidence tracking
- Investigation notes

#### MarketplaceStore / MarketplaceProduct / MarketplaceOrder
- Seller storefront management
- Product listings
- Order management
- Commission tracking

#### SecurityLog
- All user actions logged
- Risk scoring
- IP tracking
- Fraud detection

---

## 🔌 API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Body: { email, name, password, passwordConfirm }
Response: { token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user, wallets }
```

### Wallets

#### Get Balance
```
GET /api/wallets/balance
Headers: { Authorization: "Bearer {token}" }
Response: { wallets, totalBalance }
```

### Transfers

#### Create Transfer
```
POST /api/transfers/create
Headers: { Authorization: "Bearer {token}" }
Body: { recipientEmail, amount, currency, notes }
Response: { transferId, status, fee, total }
```

### Refunds

#### Create Refund
```
POST /api/refunds/create
Headers: { Authorization: "Bearer {token}" }
Body: { originalOrderId, amount, currency, reason, refundType, scheduledDate }
Response: { refundId, status, amount }
```

### Fund Recovery

#### Create Recovery Case
```
POST /api/recovery/create
Headers: { Authorization: "Bearer {token}" }
Body: { fraudType, amount, currency, description, evidence }
Response: { caseId, caseNumber, status }
```

### Marketplace

#### Create Store
```
POST /api/marketplace/store/create
Headers: { Authorization: "Bearer {token}" }
Body: { storeName, description, logo }
Response: { storeId, storeName, storeSlug }
```

### Users

#### Get Profile
```
GET /api/users/profile
Headers: { Authorization: "Bearer {token}" }
Response: { user, wallets, totalBalance }
```

#### Update Profile
```
PUT /api/users/profile
Headers: { Authorization: "Bearer {token}" }
Body: { name, phone, profileImage }
Response: { user }
```

### Transactions

#### Get Transaction History
```
GET /api/transactions/history?limit=50&offset=0
Headers: { Authorization: "Bearer {token}" }
Response: { transactions, pagination }
```

---

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- bcryptjs password hashing
- Token expiration (7 days default)

### Authorization
- User isolation (users can only access their own data)
- Role-based access control (personal, business, premium)

### Data Protection
- Encrypted sensitive data
- SQL injection prevention (Prisma parameterized queries)
- Rate limiting ready
- HTTPS recommended for production

### Compliance
- KYC/AML verification status
- Compliance record tracking
- Security event logging
- Full audit trail of transactions

---

## 🧪 Testing with Postman

### 1. Register User
```
POST http://localhost:3001/api/auth/register
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123",
  "passwordConfirm": "SecurePass123"
}
```

### 2. Login
```
POST http://localhost:3001/api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

Save the returned `token`.

### 3. Get Balance (using token)
```
GET http://localhost:3001/api/wallets/balance
Headers:
  Authorization: Bearer {token}
```

### 4. Create Transfer
```
POST http://localhost:3001/api/transfers/create
Headers:
  Authorization: Bearer {token}
Body:
{
  "recipientEmail": "recipient@example.com",
  "amount": 100,
  "currency": "USD",
  "notes": "Payment for services"
}
```

---

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── register/route.ts
│   │   └── login/route.ts
│   ├── wallets/
│   │   └── balance/route.ts
│   ├── transfers/
│   │   └── create/route.ts
│   ├── refunds/
│   │   └── create/route.ts
│   ├── recovery/
│   │   └── create/route.ts
│   ├── transactions/
│   │   └── history/route.ts
│   ├── users/
│   │   └── profile/route.ts
│   └── marketplace/
│       └── store/
│           └── create/route.ts
├── (auth)/
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   └── page.tsx
├── services/
│   ├── wallet/page.tsx
│   ├── transfers/page.tsx
│   ├── refunds/page.tsx
│   ├── recovery/page.tsx
│   ├── marketplace/page.tsx
│   └── security/page.tsx
├── layout.tsx
└── page.tsx

lib/
├── auth.ts (JWT, password hashing)
├── api-response.ts (Response formatting)
├── prisma.ts (Prisma client)
└── utils.ts

prisma/
├── schema.prisma (Database schema)
└── migrations/

public/
└── images/ (All SVG and image assets)
```

---

## 🌐 Environment Variables

### Required (Development)
```
DATABASE_URL=postgresql://user:password@localhost:5432/beaconbank
JWT_SECRET=min_32_characters_secret_key
NODE_ENV=development
```

### Optional (Production)
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=app_password
```

---

## 🚀 Running Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3001`

---

## 📦 Next Steps

1. **Database Migration**
   ```bash
   npx prisma migrate dev
   ```

2. **Frontend Integration**
   - Update frontend API calls to use `/api/` endpoints
   - Store JWT token in localStorage
   - Include token in Authorization header for authenticated requests

3. **Payment Integration**
   - Add Stripe integration for transfers
   - Configure webhook handlers

4. **Email Notifications**
   - Set up SMTP configuration
   - Send emails for important events

5. **Deployment**
   - Use production PostgreSQL instance
   - Set secure environment variables
   - Enable HTTPS

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432

Solution:
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env.local
3. Verify database exists: psql -U postgres -c "\\l"
```

### Migration Error
```
Solution:
npx prisma migrate reset --force
npx prisma migrate dev --name init
```

### JWT Token Invalid
```
Solution:
1. Ensure JWT_SECRET is set in .env.local
2. Check token expiration
3. Generate new token by logging in again
```

---

## 📞 Support

For issues or questions:
1. Check the API response error messages
2. Review security logs in Prisma Studio
3. Check server console for detailed error traces
