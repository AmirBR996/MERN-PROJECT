# 🌾 Krishik Bazar

A farmer-to-buyer produce marketplace for Nepal. Farmers and sellers list fresh
produce — vegetables, fruits, grains, dairy, and more — while buyers browse,
add to cart, check out, and track their orders.

Built as a **MERN stack monorepo**: a React SPA frontend paired with an
Express + MongoDB backend.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [API Overview](#api-overview)
- [Notes & Known Limitations](#notes--known-limitations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

### Backend (`Backend/`)
| Tool | Purpose |
|---|---|
| Node.js + Express 5 | API server |
| MongoDB + Mongoose 9 | Database & ODM |
| `jsonwebtoken` | Authentication (JWT) |
| `bcrypt` / `bcryptjs` | Password hashing |
| `nodemailer` | Transactional email (OTP / notifications) |
| `cors`, `dotenv` | CORS handling & environment config |

Runs on **port 8080**.

### Frontend (`Front_end/krishik/`)
| Tool | Purpose |
|---|---|
| React 19 + Vite 7 | UI framework & build tooling |
| Tailwind CSS v4 | Styling (design tokens via `@theme` in `src/index.css`) |
| React Router 7 | Client-side routing |
| `lucide-react` | Icons |
| `react-hot-toast` | Toast notifications |
| Axios | API calls (base URL `http://localhost:8080`) |

Runs on **port 5173** (Vite default).

---

## Project Structure

```
.
├── Backend/                 # Express API server
│   └── src/
│       ├── config/          # DB + app configuration
│       ├── controller/      # Request handlers
│       ├── middlewares/     # Auth / validation middleware
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routers (/auth, /users, /products, /orders)
│       ├── services/        # Business logic (email, payments, etc.)
│       ├── templates/       # Email templates
│       ├── utils/           # Shared helpers
│       └── server.js        # Entry point
│
└── Front_end/krishik/       # React SPA
    └── src/
        ├── api/              # Axios instances / backend calls
        ├── components/       # header, footer, cards, cart, order, product, form, ui
        ├── contexts/         # CartContext, AuthContext
        ├── pages/            # Route pages (home, marketplace, cart, checkout, ...)
        ├── services/         # Frontend services (e.g. payment)
        ├── utils/            # Helpers (formatting, sorting)
        └── index.css         # Tailwind v4 theme tokens + global styles
```

---

## Prerequisites

- **Node.js 18+** (tested with the versions pinned in `package.json`)
- A running **MongoDB** instance (local `mongod` or a MongoDB Atlas URI)
- A **Gmail** (or other SMTP) account for sending OTP / transactional email

---

## Environment Variables

The backend reads configuration from `Backend/.env` (git-ignored). Create the
file with the following keys and fill in your own values:

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

> ⚠️ **Port coupling:** the frontend expects the backend at
> `http://localhost:8080` (see `Front_end/krishik/src/api/index.js`), and the
> backend's CORS config only allows `http://localhost:5173`. If you change
> either port, update both sides.

---

## Getting Started

### 1. Install dependencies

```bash
# Backend
cd Backend
npm install

# Frontend (in a separate terminal)
cd Front_end/krishik
npm install
```

### 2. Configure environment

Create `Backend/.env` using the variables listed [above](#environment-variables).

### 3. Run the apps

```bash
# Terminal 1 — API server (http://localhost:8080)
cd Backend
npm run dev

# Terminal 2 — Web app (http://localhost:5173)
cd Front_end/krishik
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Scripts

| Location | Command | Description |
|---|---|---|
| `Backend` | `npm run dev` | Start the API with `--watch` (auto-restart) |
| `Front_end/krishik` | `npm run dev` | Start the Vite dev server |
| `Front_end/krishik` | `npm run build` | Production build to `dist/` |
| `Front_end/krishik` | `npm run preview` | Preview the production build |
| `Front_end/krishik` | `npm run lint` | Run ESLint |

---

## API Overview

All routes are mounted on the Express server at `http://localhost:8080`:

| Route prefix | Description |
|---|---|
| `POST /auth/*` | Registration, login, OTP verification |
| `*/users/*` | User profiles and seller information |
| `*/products/*` | Product listing, detail, create / update / delete |
| `*/orders/*` | Order placement and history |

Authentication uses **JWT**, sent as `Authorization: Bearer <token>`. The
frontend's Axios interceptor reads the token from `localStorage` and attaches
it automatically to outgoing requests.

---

## Notes & Known Limitations

- **Payments** run in sandbox mode
  (`Front_end/krishik/src/services/payment.service.js`), simulating eSewa,
  Khalti, and Cash-on-Delivery. Wire up real credentials there before
  deploying to production.
- **Email / OTP** delivery depends entirely on the SMTP settings in
  `Backend/.env` — without valid credentials, OTP flows will silently fail.
- The frontend uses a **fixed API base URL** with no Vite dev proxy, so the
  backend must always be reachable at `http://localhost:8080` during
  development.

---

## Troubleshooting

<details>
<summary><strong>Frontend can't reach the backend / CORS errors</strong></summary>

Confirm the backend is running on port 8080 and that its CORS configuration
still allows `http://localhost:5173`. If you changed either port, update
`Front_end/krishik/src/api/index.js` and the backend CORS config to match.
</details>

<details>
<summary><strong>OTP emails never arrive</strong></summary>

Double-check `SMTP_USER` / `SMTP_PASS` in `Backend/.env`. For Gmail, you'll
need an **App Password** (not your regular account password) with 2FA
enabled on the account.
</details>

<details>
<summary><strong>MongoDB connection errors on startup</strong></summary>

Verify `DB_URI` points to a reachable MongoDB instance and that the
credentials/authSource are correct. If using MongoDB Atlas, confirm your IP
is allow-listed.
</details>

---

## Contributing

Contributions are welcome! Please open an issue to discuss significant
changes before submitting a pull request.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a PR

---

## License

_No license specified yet. Add a `LICENSE` file to clarify usage terms._