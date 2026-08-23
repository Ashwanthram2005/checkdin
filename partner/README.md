# CheckDin Partner Portal

Hotel partner dashboard for managing properties, bookings, rooms, pricing, and payouts on the CheckDin platform.

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
| Dashboard | Hotel stats, today's bookings, revenue |
| Bookings | Manage check-in/check-out, approve/reject |
| Rooms | Room inventory and status management |
| Pricing | Slot pricing (3h, 6h, 12h) and rules |
| Availability | Day-by-day room availability |
| Revenue | Earnings breakdown and trends |
| Payouts | Payout history and requests |
| Reviews | Guest reviews and replies |
| Reports | Hotel performance reports |
| Audit Log | Activity tracking |
| Support | Support ticket management |
| Settings | Hotel profile and configuration |
| Login | Partner authentication |
| Rules & Policies | Hotel policies management |
| Partner Portal | Overview landing page |
| Onboarding | New partner setup flow |

## Project Structure

```
partner/
  src/
    components/
      layout/        # PartnerLayout, Sidebar, Topbar
      ui/            # Reusable UI components
      charts/        # Chart components
      dashboard/     # Dashboard widgets
    contexts/        # AuthContext, ThemeContext
    data/            # Mock data files
    hooks/           # Custom hooks
    pages/           # 16 pages
    services/        # API service layer
    types/           # TypeScript interfaces
    utils/           # Formatting utilities
```

## Partner Login

Partners use a two-step login:
1. Enter hotel ID to see available users
2. Select user and enter password

## Features

- Real-time booking management (approve, reject, check-in, check-out)
- Room status tracking (available, occupied, maintenance)
- Slot-based pricing (3-hour, 6-hour, 12-hour)
- Day-level availability management
- Revenue and payout tracking
- Guest review responses
