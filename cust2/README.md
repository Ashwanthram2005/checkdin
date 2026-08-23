# CheckDin Customer App (Variant 2)

Customer-facing hotel booking application (alternate variant). Browse hotels, make bookings, manage reservations, and track stays.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React 18.3 |
| Language | TypeScript 5.5 |
| Bundler | Vite 5.2 |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Routing | React Router v6 |
| Date Utils | date-fns |

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
| Home | Landing page with search and featured hotels |
| Search | Hotel search results with filters |
| Hotel Detail | Hotel info, rooms, pricing, reviews |
| Checkout | Booking form with guest details |
| Confirmation | Booking success with OTP |
| Bookings | User's booking history |
| Profile | User profile and emergency contacts |
| List Property | Partner onboarding form |
| Support | Help and support |

## Project Structure

```
cust2/
  src/
    components/
      layout/        # App layout, navigation
      ui/            # Reusable UI components
    contexts/        # AuthContext, ThemeContext
    data/            # Mock hotel and booking data
    pages/           # 9 pages
    services/        # API service layer
    types/           # TypeScript interfaces
    utils/           # Formatting, date helpers
```

## Difference from Variant 1

This is an alternate UI variant of the customer app. Both cust1 and cust2 share the same page structure and dependencies but may differ in visual design and layout choices.
