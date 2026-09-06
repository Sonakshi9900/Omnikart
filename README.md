# OmniKart — Next-Gen Multi-Vendor Marketplace Platform 🛒✨

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://omnikart-platform.vercel.app/)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_%2B_Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe Connect](https://img.shields.io/badge/Payments-Stripe_Connect-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

**OmniKart** is a production-ready, full-stack multi-vendor e-commerce platform built on the MERN stack. Designed with a mobile-first native experience, transparent vendor payouts, dynamic seller trust metrics, and an Obsidian Glass UI system.

🌐 **Live Production Application**: [https://omnikart-platform.vercel.app/](https://omnikart-platform.vercel.app/)

---

## 🚀 Key Standout Architecture & Features

### 1. 🛡️ Dynamic Vendor Trust Score System
Every product card, modal, and vendor profile surfaces a calculated **Vendor Trust Score (0–100%)** based on:
- Fulfillment speed and order tracking accuracy
- Customer reviews and rating averages
- Admin verification and dispute resolution history

### 2. 📊 Transparent Payout Split
On product detail modals and checkout views, buyers see an exact financial breakdown:
- **85% Direct Seller Revenue**: Dispatched directly to independent creators via Stripe Connect / UPI.
- **15% Platform Infrastructure & Security**: Covers buyer protection guarantees, server infrastructure, and escrow handling.

### 3. 📱 Mobile-First Native App Experience
- **Fluid Swipeable Horizontal Containers**: Touch-pan category chips and flash deal cards built with `snap-x snap-mandatory` for native mobile gestures.
- **Mobile Bottom Navigation Bar**: Fixed high `z-index` app control bar for single-thumb navigation (`Home`, `Categories`, `Cart`, `Account`).
- **Responsive Layout Constraints**: Centralized container `max-w-7xl` prevents awkward stretching on wide desktop monitors.

### 4. 💳 Multi-Vendor Order Splitting & Stripe Connect
- Single customer checkout generates atomic sub-orders grouped per vendor.
- Sellers track and fulfill their own items independently from their Vendor Dashboard.

---

## 🎨 Visual Identity & Design System

- **Brand Color Palette**:
  - **Base Background**: Deep Navy (`#0B1330`), Surface (`#101B3D`), Card (`#16214A`).
  - **Brand Blue**: Electric Blue (`#1D63E0` DEFAULT, `#2F8CFF` light, `#0B3FA0` dark) matching the logo's "O" wheel.
  - **Brand Orange**: Vibrant Orange (`#FF8A00` DEFAULT, `#FFB020` light, `#FF6A00` dark) matching the logo's "Kart" gradient.
  - **CTA Gradient**: Blue-to-Orange transition (`bg-brand-gradient`) for high-conversion CTAs.
- **Typography System**:
  - **Headings**: `Space Grotesk` (Geometric Futuristic Display)
  - **Body Text**: `Plus Jakarta Sans` (Ultra-legible Sans)
- **Background Texture**: Geometric Dot Grid pattern (`bg-grid-pattern`) over deep navy base.

---

## 🛠️ Tech Stack & Directory Architecture

```
OmniKart/
├── client/                     # Vite + React + Tailwind + Redux Toolkit
│   ├── src/
│   │   ├── components/
│   │   │   ├── customer/      # ProductGrid, ProductCard, QuickViewModal, CartDrawer
│   │   │   ├── vendor/        # RevenueChart, ProductFormModal, OrderFulfillmentTable
│   │   │   ├── admin/         # VendorApprovalTable, CommissionRateModal
│   │   │   └── layout/        # MainLayout, PageTransition, Navbar, BottomNavBar, Footer
│   │   ├── store/             # Redux Store (authSlice, cartSlice)
│   │   ├── utils/             # currency.js (formatINR)
│   │   └── pages/             # StorefrontPage, AuthPage, CheckoutPage, Dashboards
│   └── vercel.json
├── server/                     # Node.js + Express + Mongoose + Stripe
│   ├── api/index.js           # Serverless Vercel Entry Point
│   ├── src/
│   │   ├── config/            # DB & Stripe Initialization
│   │   ├── controllers/       # Auth, Product, Order, Vendor, Admin Controllers
│   │   ├── models/            # User, VendorProfile, Product, Order Schemas
│   │   └── routes/            # REST API Route Declarations
│   └── vercel.json
└── vercel.json                 # Monorepo Single-Domain Router
```

---

## 💻 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Sonakshi9900/OmniKart.git
cd OmniKart
```

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/omnikart
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies & Run Locally
```bash
# Terminal 1: Backend Server
cd server
npm install
npm start

# Terminal 2: Frontend Client
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📄 License
This project is licensed under the MIT License.
