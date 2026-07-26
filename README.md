# 👕 Keystone Apparel System - Demo Version

> **⚠️ Demo Mode**: This application is a fully functional Point-of-Sale (POS) and Analytics system running with browser `localStorage` for data persistence. No database configuration or API keys required!

---

## 🌟 Overview & Purpose

**Keystone Apparel System** is a modern Point-of-Sale (POS), Inventory COGS tracking, and Sales Analytics dashboard built for apparel businesses. It enables staff and sellers to record sales transactions in real-time, track advance pre-orders, monitor live profit margins, and analyze seller performance and design popularity.

---

## ✨ Key Features

### 🛒 1. Interactive POS Register (`/`)
- **Visual Product Selectors**: Touchable product type cards (👕 T-Shirt, 🧥 Hoodie, 🏷️ Sticker).
- **Color Swatches & Size Pills**: Tactile color swatch buttons with true-color indicators and one-tap size pills (`S`, `M`, `L`, `XL`, `2XL`, `3XL`).
- **Live Profit Margin & COGS Breakdown**: Calculates item COGS (Cost of Goods Sold) and estimated gross profit margin ($ & %) in real-time as item attributes and deal discounts are selected.
- **Bundle Deals & Promotional Discounts**:
  - 2 T-Shirts for $34.99 / $24.99
  - BOGO (Buy Hoodie, Get T-Shirt Free)
  - 30% Off, $10 Off T-Shirt, 50% Off Hoodie, $2 / $15 Fixed Discounts
- **Responsive Dual-Form Layout**:
  - **Desktop (`lg:`)**: Side-by-side side-panel forms for **Record Sale 🤩** and **Record Presale 😟**.
  - **Mobile (`< lg`)**: Sleek `Switch` control bar to toggle seamlessly between Sale and Presale forms.

---

### 📊 2. Sales Analytics & Performance Dashboard (`/sales-report`)
- **Daily Summary Metrics**: Gradient stat cards showing total revenue, gross profit, item counts, and payment method distribution (Card vs Cash).
- **IBC Financial Calendar**: Line-item transaction tables and weekly total summaries grouped by the IBC financial calendar.
- **Seller Performance Leaderboard**: Ranked leaderboard with medal badges (🥇, 🥈, 🥉), percentage share of total sales, and a seller search filter.
- **Design Popularity Meter**: Visual progress bars displaying sales volume and market share for each apparel design (e.g., *Child of God*, *Doubt Not*, *Line Upon Line*, *King of Kings*, etc.).

---

### 📦 3. Presales Order Fulfillment (`/presales`)
- **Unearned Revenue & Inventory COGS Tracking**: Financial summary callouts for pending pre-orders.
- **Batch Order Fulfillment**: Multi-select pending presale orders and mark them sold to automatically transfer them into the Sales ledger.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [React Router v7](https://reactrouter.com/) (Single Page App Mode) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Glassmorphism Tokens |
| **UI Primitives** | [shadcn/ui](https://ui.shadcn.com/) + Radix UI (`@radix-ui/react-switch`, `@radix-ui/react-dialog`, etc.) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) + [Zod Validation](https://zod.dev/) |
| **Package Manager** | [pnpm](https://pnpm.io/) |
| **Database (Demo)** | Browser `localStorage` mock adapter |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v20+` or `v24+`
- `pnpm` (`v9+` or `v11+`)

### Installation & Development

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Building & Scripts

```bash
# Type check TypeScript files
pnpm typecheck

# Build production bundle
pnpm build

# Start production server
pnpm start
```

---

## 💾 Local Data Management

All demo data is stored locally in browser `localStorage` under these keys:
- `Sales` - Executed sales transactions
- `presales` - Advance presale orders

### Resetting Demo Data
Open your browser's Developer Tools Console (`F12`) and run:

```javascript
// Clear all demo data
localStorage.clear()
```

---

## 🔄 Converting to Production Database

To connect this application to a real cloud database (e.g., Supabase / PostgreSQL):

1. Install your database client package:
   ```bash
   pnpm add @supabase/supabase-js
   ```
2. Update `app/lib/database.ts` to forward queries to your database client.
3. Configure environment variables in `.env`.

---

Built with ❤️ for **Keystone Apparel**.
