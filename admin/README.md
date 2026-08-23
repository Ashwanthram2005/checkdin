# CheckDin Admin Dashboard

Internal admin console for managing the CheckDin hotel booking platform. Provides full control over bookings, properties, partners, customers, finances, and platform settings.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React 18.3 |
| Language | TypeScript 5.5 |
| Bundler | Vite 5.2 |
| Styling | Tailwind CSS 3.4 |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Routing | React Router v6 |

## Prerequisites

- Node.js 18+
- Backend server running on `http://localhost:3001`

## Setup

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Pages

| Page | Description |
|------|-------------|
| Dashboard | KPIs, recent activity, quick actions |
| Bookings | List/search/filter all bookings |
| Booking Detail | Full booking view with timeline |
| Properties | List/manage all properties |
| Property Detail | Property info, rooms, documents |
| Rooms | Room inventory across properties |
| Partners | Partner list and management |
| Partner Detail | Partner profile, KYC, properties |
| Customers | Customer database |
| Customer Detail | Customer profile, booking history |
| Revenue | Revenue charts and breakdown |
| Payouts | Partner payout management |
| Refunds | Refund request processing |
| Reviews | Review moderation |
| Support | Ticket management |
| Coupons | Coupon creation and management |
| Pricing Management | Dynamic pricing rules |
| Campaigns | Marketing campaign tracking |
| Notifications | Notification management |
| CMS | Banners, cities, SEO, promotions |
| Reports | Analytics and reports |
| Audit Logs | System audit trail |
| Fraud Detection | Fraud alert management |
| Admin Users | Team and role management |
| Settings | Platform configuration |
| Login | Admin authentication |

## Project Structure

```
admin/
  src/
    components/
      auth/          # Auth guards, role selector
      layout/        # AdminLayout, Sidebar, Topbar
      ui/            # Reusable UI components (Button, Card, Badge, DataTable, Modal, etc.)
      charts/        # Chart components
      dashboard/     # KpiCard
      comms/         # Internal communications
    contexts/        # AuthContext, ThemeContext, CommsContext
    data/            # Mock data files
    hooks/           # useMockQuery
    pages/           # 21 pages + 5 comms sub-pages
    services/        # API service layer
    types/           # TypeScript interfaces
    utils/           # Formatting, chart themes
```

## Key Components

- **DataTable** — Sortable, paginated table with column definitions
- **Modal** — Dialog with header, body, footer
- **Badge** — Status indicator with tone variants
- **PageHeader** — Page title with action buttons
- **Tabs** — Tab navigation
- **SegmentedControl** — Inline option switcher

## Roles

| Role | Access |
|------|--------|
| Super Admin | Full access to all modules |
| Operations Admin | Bookings, properties, rooms, partners |
| Finance Admin | Revenue, payouts, refunds, reports |
| Support Admin | Tickets, customer support |
| Marketing Admin | Coupons, campaigns, CMS, notifications |
