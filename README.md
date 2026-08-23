# CheckDin

A full-stack hotel booking platform (similar to OYO/RedDoorz) with hourly and overnight stay options. Includes admin dashboard, partner portal, and customer-facing apps.

## Architecture

```
checkdin/
  backend/       Fastify + PostgreSQL REST API
  admin/         Admin dashboard (React + TypeScript)
  partner/       Hotel partner portal (React + TypeScript)
  cust1/         Customer app variant 1 (React + TypeScript)
  cust2/         Customer app variant 2 (React + TypeScript)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Fastify 5.2, PostgreSQL |
| Frontend | React 18.3, TypeScript 5.5, Vite 5.2 |
| Styling | Tailwind CSS 3.4 |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |

## Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 12+

### 2. Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE checkdin;"

# Navigate to backend
cd backend

# Install dependencies
npm install

# Seed the database (creates tables + test data)
npm run seed
```

### 3. Start Backend

```bash
# From backend/ directory
npm start
# Server runs on http://localhost:3001
```

### 4. Start Frontend Apps

Open separate terminals for each app:

```bash
# Admin Dashboard (http://localhost:5173)
cd admin && npm install && npm run dev

# Partner Portal (http://localhost:5173)
cd partner && npm install && npm run dev

# Customer App v1 (http://localhost:5173)
cd cust1 && npm install && npm run dev

# Customer App v2 (http://localhost:5173)
cd cust2 && npm install && npm run dev
```

> Note: Each frontend runs on port 5173 by default. To run multiple simultaneously, Vite will auto-increment the port (5174, 5175, etc.) or you can configure it in `vite.config.ts`.

## Default Credentials

### Admin

| Email | Password | Role |
|-------|----------|------|
| superadmin@checkdin.com | Super@123 | Super Admin |
| operations@checkdin.com | Ops@123 | Operations Head |
| finance@checkdin.com | Finance@123 | Finance Manager |
| support@checkdin.com | Support@123 | Support Lead |
| marketing@checkdin.com | Marketing@123 | Marketing Head |

### Partner

| Hotel ID | User | Password |
|----------|------|----------|
| CHK-EMPIRE-017 | Empire Admin | 1234 |

### Customer

Any email/phone combination will auto-create a customer account.

## Project Structure

```
checkdin/
  backend/
    server.js          # All API routes (900+ lines)
    schema.sql         # 26 PostgreSQL tables
    seed.js            # Database seeder
    test_all.js        # Integration tests
    package.json

  admin/
    src/
      pages/           # 26 admin pages
      components/      # UI library (Button, Card, DataTable, Modal, etc.)
      services/        # API service layer
      contexts/        # Auth, Theme, Communications
      types/           # TypeScript interfaces
      data/            # Mock data

  partner/
    src/
      pages/           # 16 partner pages
      components/      # UI components
      services/        # API service layer

  cust1/
    src/
      pages/           # 9 customer pages
      components/      # UI components

  cust2/
    src/
      pages/           # 9 customer pages (variant 2)
      components/      # UI components
```

## API Overview

The backend serves all apps from a single server:

| Prefix | App | Auth |
|--------|-----|------|
| `/api/auth/` | Authentication | Public |
| `/api/admin/` | Admin dashboard | Admin token |
| `/api/partner/` | Partner portal | Partner token |
| `/api/customer/` | Customer app | Customer token |

See [backend/README.md](backend/README.md) for full API documentation.

## Database

26 tables covering:

- **Auth**: admin_users, partner_users, customers
- **Inventory**: properties, rooms, hotels, slot_pricing
- **Bookings**: bookings, customer_bookings
- **Finance**: payouts, refunds, earnings
- **Engagement**: reviews, tickets, coupons, campaigns
- **Governance**: audit_logs, fraud_alerts, pricing_rules, settings, cms_content

See [backend/README.md](backend/README.md) for full schema details.

## Running Tests

```bash
cd backend
npm test
```

## Build for Production

```bash
# Build any frontend app
cd admin && npm run build
cd partner && npm run build
cd cust1 && npm run build
cd cust2 && npm run build

# Output is in each app's dist/ directory
```

## Environment Variables

Backend can be configured via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `HOST` | `0.0.0.0` | Server host |
| `SECRET` | `checkdin-secret-key-...` | Token signing secret |
| `PGHOST` | `localhost` | PostgreSQL host |
| `PGPORT` | `5432` | PostgreSQL port |
| `PGDATABASE` | `checkdin` | Database name |
| `PGUSER` | `postgres` | Database user |
| `PGPASSWORD` | `postgres` | Database password |
