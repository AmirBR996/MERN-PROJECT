# 🌾 Krishik Bazar (कृषिक बाजार)

> **Connecting Nepal's agricultural heartland directly to buyers.**  
> A modern, full-stack marketplace built to empower local farmers, streamline supply chains, and deliver fresh produce straight to consumers.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://react.dev)
[![Vite 7](https://img.shields.io/badge/Frontend-Vite_7_%2B_React_19-646CFF.svg)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC.svg)](https://tailwindcss.com)
[![Express 5](https://img.shields.io/badge/Backend-Express_5_%2B_Node.js-000000.svg)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_%2B_Mongoose_9-47A248.svg)](https://www.mongodb.com)

---

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Scripts](#-scripts)
- [API Overview](#-api-overview)
- [Notes & Known Limitations](#-notes--known-limitations)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Live Demo

- **Frontend App:** [krishik-bazar.vercel.app](https://krishik-bazar-3sv7y4p72-amirbr996s-projects.vercel.app/)
- **Backend API:** [krishik-bazar-api.onrender.com](https://krishik-bazar-api.onrender.com)

---

## ✨ Key Features

* **Direct Farmer Marketplace:** Browse, list, and buy fresh vegetables, fruits, grains, and dairy products.
* **OTP Authentication:** Secure registration and passwordless login powered by JWT and transactional email delivery via Nodemailer.
* **Role-Based Access:** Dedicated dashboards and workflows for both buyers and seller/farmers.
* **Smart Shopping Cart & Checkout:** Seamless order management with support for sandbox payments (eSewa, Khalti, Cash-on-Delivery).
* **Responsive UI:** Built with React 19, Tailwind CSS v4, and Lucide icons for an intuitive mobile-first experience.

---

## 🛠️ Tech Stack

### Backend (`Backend/`)
| Tool | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose 9 | Database & Object Data Modeling (ODM) |
| `jsonwebtoken` | Authentication (JWT) |
| `bcrypt` / `bcryptjs` | Secure password hashing |
| `nodemailer` | Transactional email (OTP verification / order updates) |
| `cors`, `dotenv` | CORS handling & environment variable configuration |

*Runs on **port 8080** by default.*

### Frontend (`Front_end/krishik/`)
| Tool | Purpose |
|---|---|
| React 19 + Vite 7 | Modern UI framework & high-speed build tooling |
| Tailwind CSS v4 | Utility-first styling (design tokens via `@theme` in `src/index.css`) |
| React Router 7 | Client-side page navigation |
| `lucide-react` | Scalable icon library |
| `react-hot-toast` | Interactive toast notifications |
| Axios | HTTP client (with auto-attached Bearer tokens) |

*Runs on **port 5173** (Vite default).*

---

## 📂 Project Structure

```text
.
├── Backend/                 # Express API server
│   └── src/
│       ├── config/          # DB connection & app settings
│       ├── controller/      # Request handler functions
│       ├── middlewares/     # JWT authentication & validation middleware
│       ├── models/          # Mongoose database schemas
│       ├── routes/          # Express route definitions (/auth, /users, /products, /orders)
│       ├── services/        # Business logic (email, payments, etc.)
│       ├── templates/       # HTML email layouts
│       ├── utils/           # Helper utility functions
│       └── server.js        # Server entry point
│
└── Front_end/krishik/       # React Single Page Application (SPA)
    └── src/
        ├── api/              # Axios instance setup & backend API calls
        ├── components/       # Reusable components (Header, Footer, Cards, Cart, Order, Forms)
        ├── contexts/         # Global contexts (CartContext, AuthContext)
        ├── pages/            # Route views (Home, Marketplace, Cart, Checkout, Dashboard)
        ├── services/         # Frontend integration services (Payment gateway helpers)
        ├── utils/            # Helper utilities (formatting, sorting, calculations)
        └── index.css         # Tailwind v4 theme tokens & global styles

⚙️ Prerequisites

    Node.js 18+ installed on your system

    A running MongoDB instance (Local mongod service or a MongoDB Atlas URI)

    An SMTP Service Account (e.g., Gmail with an App Password) for sending OTPs and emails

🔑 Environment Variables

The backend loads configuration settings from Backend/.env (which is git-ignored). Create this file in the Backend/ folder with the following key-value pairs:
Code snippet

# Database Settings
DB_URI=mongodb://<user>:<pass>@localhost:27017/?authSource=admin
DB_NAME=krishik

# SMTP Settings (Email & OTP Delivery)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Krishik Bazar <your-email@gmail.com>"

    ⚠️ Port Coupling Notice: The frontend expects the backend API at http://localhost:8080 (configured in Front_end/krishik/src/api/index.js), while the backend CORS restricts requests to http://localhost:5173. If you change ports on either side, remember to update both.

    🌐 Production Deployment: For production builds, point the frontend's API base URL to https://krishik-bazar-api.onrender.com.

⚡ Getting Started
1. Install Dependencies
Bash

# Clone the repository
git clone [https://github.com/your-username/krishik-bazar.git](https://github.com/your-username/krishik-bazar.git)
cd krishik-bazar

# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies (in a new terminal window or tab)
cd ../Front_end/krishik
npm install

2. Configure Environment

Create the Backend/.env file as detailed in the Environment Variables section.
3. Run the Application
Bash

# Terminal 1 — Start API Server (http://localhost:8080)
cd Backend
npm run dev

# Terminal 2 — Start Vite Dev Server (http://localhost:5173)
cd Front_end/krishik
npm run dev

Open http://localhost:5173 in your browser to view the application.
📜 Available Scripts
Directory	Command	Description
Backend/	npm run dev	Starts the Express server using Node's native --watch mode
Front_end/krishik/	npm run dev	Launches the Vite local development server
Front_end/krishik/	npm run build	Compiles production assets into dist/
Front_end/krishik/	npm run preview	Serves the production build locally for verification
Front_end/krishik/	npm run lint	Runs ESLint code quality checks
🛰️ API Overview

All backend routes are relative to http://localhost:8080:
Endpoint Prefix	Description	Authentication
POST /auth/*	User registration, login, and OTP email verification	Public
GET/POST /users/*	User profiles and seller information management	Private (JWT)
GET/POST /products/*	Browse produce, fetch details, or create/update listings	Public / Private (Seller)
GET/POST /orders/*	Checkout cart, place orders, and view order history	Private (JWT)

Authentication relies on JSON Web Tokens (JWT) sent via the HTTP standard header Authorization: Bearer <token>. The client automatically injects stored tokens into outgoing requests via an Axios interceptor.
⚠️ Notes & Known Limitations

    Payment Gateways: eSewa, Khalti, and Cash-on-Delivery logic (Front_end/krishik/src/services/payment.service.js) currently run in sandbox/simulation mode. Real merchant IDs and API keys must be integrated for production deployment.

    Transactional Emails: OTP verification requires valid SMTP credentials. When using Gmail, ensure 2-Factor Authentication (2FA) is active and generate a dedicated App Password.

    Fixed API Endpoint: The frontend relies on a fixed API base URL rather than a Vite dev proxy. Keep the backend running on port 8080 during local execution.

🔍 Troubleshooting

Verify that the backend is active on port 8080 and that its CORS configuration permits requests from http://localhost:5173. If ports were altered, synchronize Front_end/krishik/src/api/index.js and Backend/src/server.js.

Verify SMTP_USER and SMTP_PASS in Backend/.env. For Gmail, use an App Password instead of your primary Google account password.

Check that DB_URI targets an active MongoDB service and contains valid credentials. If utilizing MongoDB Atlas, verify that your current IP address is whitelisted under Network Access.
🤝 Contributing

Contributions are welcome! Feel free to report issues or submit pull requests.

    Fork the repository

    Create a feature branch (git checkout -b feature/AmazingFeature)

    Commit your changes (git commit -m 'Add some AmazingFeature')

    Push to your branch (git push origin feature/AmazingFeature)

    Open a Pull Request

📄 License

Distributed under the MIT License. See LICENSE for details.