# CheckDin Backend

REST API server for the CheckDin hotel booking platform. Built with Fastify 5 + PostgreSQL.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js |
| Framework | Fastify 5.2.1 |
| Database | PostgreSQL (via `pg` 8.13.1) |
| Auth | Custom HMAC-signed tokens |
| CORS | @fastify/cors |

## Prerequisites

- Node.js 18+
- PostgreSQL 12+

## Setup

```bash
# Install dependencies
npm install

# Create the database
psql -U postgres -c "CREATE DATABASE checkdin;"

# Seed the database (drops and recreates all tables)
npm run seed

# Start the server
npm start
```

The server runs on `http://localhost:3001` by default.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `HOST` | `0.0.0.0` | Server host |
| `SECRET` | `checkdin-secret-key-...` | HMAC signing secret |
| `PGHOST` | `localhost` | PostgreSQL host |
| `PGPORT` | `5432` | PostgreSQL port |
| `PGDATABASE` | `checkdin` | Database name |
| `PGUSER` | `postgres` | Database user |
| `PGPASSWORD` | `postgres` | Database password |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with file watching |
| `npm run seed` | Seed database with test data |
| `npm test` | Run integration tests |

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/admin` | Admin login (email + password) |
| POST | `/api/auth/login/customer` | Customer login (auto-creates if not found) |
| POST | `/api/auth/login/partner` | Partner two-step login |
| GET | `/api/auth/me` | Get current user info |
| PUT | `/api/auth/profile` | Update customer profile |

### Admin API (requires `Authorization: Bearer <token>`)

| Resource | List | Detail | Create | Update | Delete |
|----------|------|--------|--------|--------|--------|
| Dashboard | `GET /dashboard` | - | - | - | - |
| Bookings | `GET /bookings` | `GET /bookings/:id` | - | `POST /bookings/:id/mutate` | - |
| Properties | `GET /properties` | `GET /properties/:id` | - | `POST /properties/:id/mutate` | - |
| Rooms | `GET /rooms` | `GET /rooms/:id` | `POST /rooms` | `POST /rooms/:id/mutate` | - |
| Partners | `GET /partners` | `GET /partners/:id` | - | `POST /partners/:id/mutate` | - |
| Customers | `GET /customers` | `GET /customers/:id` | - | `POST /customers/:id/mutate` | - |
| Payouts | `GET /payouts` | `GET /payouts/:id` | - | `POST /payouts/:id/mutate` | - |
| Refunds | `GET /refunds` | `GET /refunds/:id` | - | `POST /refunds/:id/mutate` | - |
| Reviews | `GET /reviews` | `GET /reviews/:id` | - | `POST /reviews/:id/mutate` | - |
| Tickets | `GET /tickets` | `GET /tickets/:id` | - | `POST /tickets/:id/mutate` | - |
| Coupons | `GET /coupons` | `GET /coupons/:id` | `POST /coupons` | `PUT /coupons/:id` | - |
| Campaigns | `GET /campaigns` | `GET /campaigns/:id` | `POST /campaigns` | `PUT /campaigns/:id` | `DELETE /campaigns/:id` |
| Admin Users | `GET /admin-users` | `GET /admin-users/:id` | `POST /admin-users` | `PUT /admin-users/:id` | `DELETE /admin-users/:id` |
| Pricing Rules | `GET /pricing-rules` | `GET /pricing-rules/:id` | `POST /pricing-rules` | `PUT /pricing-rules/:id` | `DELETE /pricing-rules/:id` |
| Fraud | `GET /fraud` | `GET /fraud/:id` | - | `POST /fraud/:id/mutate` | - |
| Audit Logs | `GET /audit-logs` | - | - | - | - |
| Reports | `GET /reports` | - | - | - | - |
| Settings | `GET /settings` | - | `POST /settings` | - | - |
| CMS | `GET /cms` | `GET /cms/:id` | `POST /cms` | `PUT /cms/:id` | `DELETE /cms/:id` |

All list endpoints support `?page=N&limit=N` pagination and field-specific filtering.

### Customer API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customer/hotels` | List hotels (supports `?search=&city=`) |
| GET | `/api/customer/hotels/:id` | Hotel detail with rooms and pricing |
| GET | `/api/customer/bookings` | Customer's bookings (auth required) |
| POST | `/api/customer/bookings` | Create booking (auth required) |
| POST | `/api/customer/bookings/:id/cancel` | Cancel booking |
| POST | `/api/customer/bookings/:id/rate` | Rate completed booking |
| POST | `/api/customer/leads` | Submit property lead |

### Partner API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/dashboard` | Partner dashboard stats |
| GET | `/api/partner/bookings` | Partner's hotel bookings |
| POST | `/api/partner/bookings/:id/:action` | Approve/reject/checkin/checkout |
| GET | `/api/partner/rooms` | Partner's rooms |
| PUT | `/api/partner/rooms` | Update room |
| GET | `/api/partner/pricing` | Slot pricing |
| PUT | `/api/partner/pricing` | Update slot pricing |
| GET | `/api/partner/availability` | Day availability |
| PUT | `/api/partner/availability/:date` | Update day availability |
| GET | `/api/partner/reviews` | Property reviews |
| POST | `/api/partner/reviews/:id/reply` | Reply to review |
| GET | `/api/partner/revenue` | Earnings history |
| GET | `/api/partner/payouts` | Payout history |
| GET | `/api/partner/reports` | Partner reports |
| GET | `/api/partner/audit-log` | Partner audit log |
| GET | `/api/partner/support` | Support tickets |
| GET | `/api/partner/settings` | Hotel settings |

## Database Schema

26 tables across:

- **Auth**: `admin_users`, `partner_users`, `partner_roles`, `customers`
- **Inventory**: `properties`, `rooms`, `hotels`, `room_profiles`, `slot_pricing`, `day_availability`
- **Bookings**: `bookings`, `customer_bookings`
- **Finance**: `payouts`, `refunds`, `earnings`
- **Engagement**: `reviews`, `tickets`, `coupons`, `campaigns`
- **Governance**: `audit_logs`, `fraud_alerts`, `pricing_rules`, `settings`, `cms_content`
- **Documents**: `property_documents`, `property_leads`, `login_activities`, `partner_audit_logs`

## Default Admin Credentials

| Email | Password | Role |
|-------|----------|------|
| superadmin@checkdin.com | Super@123 | Super Admin |
| operations@checkdin.com | Ops@123 | Operations Head |
| finance@checkdin.com | Finance@123 | Finance Manager |
| support@checkdin.com | Support@123 | Support Lead |
| marketing@checkdin.com | Marketing@123 | Marketing Head |
