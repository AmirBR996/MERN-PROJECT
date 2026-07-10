# Krishik Bazar

A farmer-to-buyer produce marketplace for Nepal. Farmers and sellers list fresh
produce (vegetables, fruits, grains, dairy, and more); buyers browse, add to cart,
check out, and track orders. Built as a MERN stack monorepo with a React SPA
frontend and an Express + MongoDB backend.

## Tech Stack

**Backend** (`Backend/`)
- Node.js + Express 5
- MongoDB via Mongoose 9
- JSON Web Tokens (`jsonwebtoken`) for auth
- `bcrypt` / `bcryptjs` for password hashing
- `nodemailer` for transactional email (OTP / notifications)
- `cors` + `dotenv`
- Runs on port **8080**

**Frontend** (`Front_end/krishik/`)
- React 19 + Vite 7
- Tailwind CSS v4 (design tokens via `@theme` in `src/index.css`)
- React Router 7 (`react-router-dom`)
- `lucide-react` (icons) and `react-hot-toast` (toasts)
- Axios for API calls (base URL `http://localhost:8080`)
- Runs on port **5173** (Vite default)

## Project Structure

```
.
├── Backend/                # Express API server
│   └── src/
│       ├── config/        # DB + app configuration
│       ├── controller/    # Request handlers
│       ├── middlewares/   # Auth / validation middleware
│       ├── models/        # Mongoose schemas
│       ├── routes/        # Express routers (/auth, /users, /products, /orders)
│       ├── services/      # Business logic (email, payments, etc.)
│       ├── templates/     # Email templates
│       ├── utils/         # Shared helpers
│       └── server.js      # Entry point
└── Front_end/krishik/     # React SPA
    └── src/
        ├── api/           # Axios instances / backend calls
        ├── components/    # header, footer, cards, cart, order, product, form, ui
        ├── contexts/      # CartContext, AuthContext
        ├── pages/         # Route pages (home, marketplace, cart, checkout, ...)
        ├── services/      # Frontend services (e.g. payment)
        ├── utils/         # Helpers (formatting, sorting)
        └── index.css      # Tailwind v4 theme tokens + global styles
```

## Prerequisites

- Node.js 18+ (tested with the versions pinned in `package.json`)
- A running MongoDB instance (local `mongod` or a MongoDB Atlas URI)
- A Gmail (or other SMTP) account for sending OTP / transactional email

## Environment Variables

The backend reads configuration from `Backend/.env` (already git-ignored). Copy the
keys below and fill in your own values:

```env
# Database
DB_URI=mongodb://<user>:<pass>@localhost:27017/?authSource=admin
DB_NAME=krishik

# SMTP (email / OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Krishik Bazar <your-email@gmail.com>"
```

> The frontend expects the backend at `http://localhost:8080` (see
> `Front_end/krishik/src/api/index.js`). CORS on the backend allows
> `http://localhost:5173`. Update both if you change ports.

## Getting Started

1. **Install dependencies**

   ```bash
   # Backend
   cd Backend
   npm install

   # Frontend (in a separate terminal)
   cd Front_end/krishik
   npm install
   ```

2. **Configure environment**

   Create `Backend/.env` using the variable list above.

3. **Run the apps**

   ```bash
   # Terminal 1 — API server (http://localhost:8080)
   cd Backend
   npm run dev

   # Terminal 2 — Web app (http://localhost:5173)
   cd Front_end/krishik
   npm run dev
   ```

Open http://localhost:5173 in your browser.

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `Backend` | `npm run dev` | Start the API with `--watch` (auto-restart) |
| `Front_end/krishik` | `npm run dev` | Start the Vite dev server |
| `Front_end/krishik` | `npm run build` | Production build to `dist/` |
| `Front_end/krishik` | `npm run preview` | Preview the production build |
| `Front_end/krishik` | `npm run lint` | Run ESLint |

## API Overview

The backend exposes REST routes mounted at:

- `POST /auth/*` — registration, login, OTP verification
- `*/users/*` — user profiles and seller information
- `*/products/*` — product listing, detail, create/update/delete
- `*/orders/*` — order placement and history

JWTs are sent in the `Authorization: Bearer <token>` header (read from
`localStorage` by the Axios interceptor).

## Notes

- **Payments** are handled in a sandbox mode (`Front_end/krishik/src/services/payment.service.js`)
  simulating eSewa / Khalti / Cash-on-Delivery. Wire up real credentials there for
  production.
- **Email / OTP** relies on the SMTP settings in `Backend/.env`.
- The frontend uses a fixed API base URL; there is no Vite dev proxy, so the
  backend must be reachable at `http://localhost:8080`.
