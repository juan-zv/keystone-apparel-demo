# Keystone Apparel System - Demo Version

An integrated sales management and reporting system built with React Router v7, TypeScript, and localStorage.

> **Note**: This is a demo version that uses browser localStorage instead of a database. All data is stored locally in your browser.

## Features

- **Sales Registration**: Record sales transactions with product details, pricing, and payment methods
- **Sales Reports**: Generate daily and weekly sales reports with analytics
- **Seller Performance**: Track individual seller statistics
- **Dark Mode**: Beautiful dark theme with mode toggle
- **Local Storage**: All data stored in browser localStorage (no external database needed)

## Setup Instructions

### 1. Install Dependencies

Install the required dependencies:

```bash
npm install
```

Or if you use pnpm:

```bash
pnpm install
```

### 2. Run the Application

Start the development server:

```bash
npm run dev
```

Or with pnpm:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### 3. Using the Demo

- All data is stored in your browser's localStorage
- No external database or API keys required
- Data persists between sessions but only in the same browser
- To reset data, use: `localStorage.clear()` in your browser console

## Demo Limitations

- Data is only stored locally in your browser
- No data synchronization across devices
- Clearing browser data will delete all records
- Not suitable for production use

## Converting to Production

To use this with a real database:

1. Install your database client: `pnpm add @supabase/supabase-js` (or your preferred solution)
2. Replace the localStorage implementation in `app/lib/database.ts`
3. Set up environment variables with your database credentials
4. See production documentation for full setup instructions

## Application Structure

```
app/
├── components/
│   ├── ui/                    # UI components (button, card, input, etc.)
│   ├── data-table.tsx         # Reusable data table component
│   ├── mode-toggle.tsx        # Theme toggle component
│   ├── seller-stats.tsx       # Seller performance statistics
│   ├── theme-provider.tsx     # Theme context provider
│   └── table/                 # Table column definitions
│       ├── columns.tsx        # Sales data columns
│       ├── totals.tsx         # Daily totals columns
│       └── weekly-totals.tsx  # Weekly totals columns
├── lib/
│   ├── utils.ts              # Utility functions
│   └── database.ts           # Database client configuration
├── routes/
│   ├── home.tsx              # Landing page
│   ├── sales-register.tsx    # Sales registration form
│   └── sales-report.tsx      # Sales reporting & analytics
├── app.css                   # Global styles
├── root.tsx                  # Root layout
└── routes.ts                 # Route configuration
```

## Routes

- `/` - Home page with navigation
- `/sales-register` - Register new sales transactions
- `/sales-report` - View sales reports and analytics

## Database Schema

The `Sales` table stores:
- Product information (type, color, design, size)
- Transaction details (price, payment method, date)
- Seller information (optional)
- Additional notes (optional)

## Features Detail

### Sales Registration
- Form validation using Zod schema
- Automatic price calculation based on product type
- Tuesday discount support
- Confirmation dialog before submission
- Success notification

### Sales Report
- Daily sales breakdown
- Weekly totals aggregation
- Seller performance tracking
- Cost of Goods Sold (COGS) calculation
- Interactive date picker
- Data tables with sorting

## Technologies Used

- **React Router v7** - Routing and navigation
- **TypeScript** - Type safety
- **localStorage** - Demo data storage
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Table** - Data tables
- **Radix UI** - Accessible components

## Support

For issues or questions, please contact the development team.

---

v0.2.0 | Made by Juansito with a LOT of love ❤️ ©2025
