# Keystone Apparel System - Demo Version

This is a **demo version** of the Keystone Apparel System, configured for demonstration and testing purposes.

## Changes from Production Version

### 1. **No Git Version Control**
- The `.git` folder has been removed
- This version has no connection to the production repository
- You can initialize a new git repository if needed with `git init`

### 2. **Local Storage Database**
- **No external database required** - all data is stored in browser localStorage
- Database operations use a localStorage-based mock implementation
- Data persists in the browser but is not synced across devices or browsers
- **Note**: Clearing browser data will delete all stored information

### 3. **Removed Dependencies**
- No external database packages required
- No environment variables needed for database connections

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will run at `http://localhost:5173` (or the next available port).

### Building for Production

```bash
pnpm build
pnpm start
```

## Data Storage

All data is stored in your browser's localStorage under these keys:
- `Sales` - All sales transactions
- `presales` - Pre-sale orders

### Clearing Demo Data

To reset all data, open your browser's developer console and run:
```javascript
localStorage.clear()
```

Or clear data for specific tables:
```javascript
localStorage.removeItem('Sales')
localStorage.removeItem('presales')
```

## Features

All features from the production version are available:
- ✅ Sales registration
- ✅ Pre-sales management
- ✅ Sales reports and analytics
- ✅ Multi-item transactions
- ✅ Discount tracking
- ✅ Seller statistics
- ✅ Design analytics

## Limitations

- Data is only stored locally in the browser
- No data synchronization across devices
- No database backups
- Clearing browser data will delete all records
- Not suitable for production use

## Converting Back to Production

To convert this to use a real database:

1. Install your preferred database client (e.g., `pnpm add @supabase/supabase-js`)
2. Update `app/lib/database.ts` to use your database client
3. Create a `.env` file with your database credentials
4. Initialize a new git repository if needed

## Support

This demo version is provided as-is for testing and demonstration purposes.
