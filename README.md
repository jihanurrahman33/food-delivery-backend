# Food Delivery Express.js Production-Grade Backend

Production-grade Express.js backend engineered for the Food Delivery application with layered Clean Architecture, Repository Pattern, Dependency Injection, and JSON file persistence with atomic write guarantees.

---

## 🏗️ Architecture & Design Patterns

- **Layered Architecture**: Clear separation of concerns across Domain, Application (Services), Infrastructure (Persistence & Payment), and Presentation (Controllers, Routes, Middleware).
- **Repository Pattern**: Persistence interfaces in `src/domain/repositories/` abstract all storage operations. Currently backed by atomic JSON storage in `src/infrastructure/persistence/json/`, swappable for PostgreSQL/MongoDB with zero business logic alterations.
- **Dependency Injection**: Centralized `DependencyContainer` in `src/container.ts` manages constructor injection of repositories into services and services into controllers.
- **Factory Pattern**: `PaymentProviderFactory` in `src/infrastructure/payment/payment-provider.factory.ts` dynamically resolves payment gateway providers (`mock`, `stripe`, `paypal`).
- **Singleton Pattern**: Type-safe configuration via `AppConfig` with Zod schema validation in `src/config/index.ts`.
- **RBAC & Security**:
  - JWT Access (`1h`) and Refresh (`30d`) tokens.
  - Role-Based Access Control (`customer`, `chef`, `rider`, `admin`).
  - Strict resource ownership checks on orders, addresses, and cards.
  - Helmet HTTP security headers, CORS origin verification, and Express rate limiting.
  - Cryptographic HMAC SHA-256 signature verification for payments and webhooks.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Configuration is loaded from `.env`:
```env
PORT=5001
NODE_ENV=development
API_PREFIX=/api/v1
CORS_ORIGIN=*
JWT_ACCESS_SECRET=food_delivery_jwt_access_super_secret_key_2026_production_grade
JWT_REFRESH_SECRET=food_delivery_jwt_refresh_super_secret_key_2026_production_grade
DATA_DIR=./data
PAYMENT_PROVIDER=mock
```

### 3. Seed Initial Data
```bash
npm run seed
```

### 4. Run Test Suite
```bash
npm test
```

### 5. Start Backend Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm run build
npm start
```

---

## 📚 API Endpoints

### 🩺 Health & Documentation
- `GET /api/v1/health` - System health check, uptime, memory telemetry.
- `GET /api-docs` - Interactive OpenAPI/Swagger documentation.

### 🔐 Authentication (`/api/v1/auth`)
- `POST /register` - Register new user account.
- `POST /login` - Authenticate with email and password, returns JWT tokens.
- `POST /refresh-token` - Renew expired access token using refresh token.
- `GET /me` - Retrieve current authenticated user profile (`Bearer JWT`).
- `PUT /me` - Update user profile information (`Bearer JWT`).
- `PUT /role` - Switch active user role (`Bearer JWT`).
- `POST /send-otp` - Dispatch authentication OTP.
- `POST /verify-otp` - Verify submitted OTP code.
- `POST /reset-password` - Update account password with verified OTP.
- `POST /logout` - Invalidate active session (`Bearer JWT`).

### 🏠 Discovery & Home (`/api/v1/home`)
- `GET /banners` - Fetch promotional home carousel banners.
- `GET /categories` - Fetch food category list.

### 🍽️ Restaurants & Menus (`/api/v1`)
- `GET /restaurants` - List restaurants with optional category and search filters.
- `GET /restaurants/:id` - Fetch restaurant details by ID.
- `GET /restaurants/:id/foods` - Fetch menu food items by restaurant ID.
- `GET /restaurants/:id/reviews` - Fetch customer reviews for restaurant.
- `POST /restaurants/:id/reviews` - Submit review and rating (`Bearer JWT`).
- `GET /foods/search` - Search dishes across all restaurants.
- `GET /foods/:id` - Fetch dish details and available addons.
- `GET /favorites` - Fetch user's saved favorite restaurants (`Bearer JWT`).
- `POST /favorites/toggle` - Toggle restaurant favorite status (`Bearer JWT`).

### 📦 Orders & Tracking (`/api/v1/orders`)
- `POST /` - Place order with verified server-side price calculations (`Bearer JWT`).
- `GET /active` - Fetch current active orders for customer (`Bearer JWT`).
- `GET /history` - Fetch past completed/cancelled orders (`Bearer JWT`).
- `GET /:id` - Retrieve order details and current status (`Bearer JWT`).
- `POST /:id/cancel` - Cancel order before dispatch (`Bearer JWT`).
- `GET /:id/chat` - Retrieve driver chat message history (`Bearer JWT`).
- `POST /:id/chat` - Send message to delivery rider (`Bearer JWT`).
- `POST /:id/rate` - Submit restaurant & rider review with rating (`Bearer JWT`).

### 💳 Payments (`/api/v1/payments`)
- `POST /initiate` (or `/create-intent`) - Create payment intent with HMAC client secret (`Bearer JWT`).
- `POST /verify` - Cryptographically verify payment reference and settle order (`Bearer JWT`).
- `GET /transactions` - Fetch user's past transaction records (`Bearer JWT`).
- `POST /webhook` - Idempotent webhook handler with signature validation.

### 👤 Profile & Settings (`/api/v1`)
- `GET /profile` - Retrieve profile (`Bearer JWT`).
- `PUT /profile` - Update profile (`Bearer JWT`).
- `GET /addresses` - List saved delivery addresses (`Bearer JWT`).
- `POST /addresses` - Add new delivery address (`Bearer JWT`).
- `DELETE /addresses/:id` - Remove address (`Bearer JWT`).
- `PUT /addresses/:id/default` - Set address as primary default (`Bearer JWT`).
- `GET /cards` - List saved payment cards (`Bearer JWT`).
- `POST /cards` - Save payment card (`Bearer JWT`).
- `DELETE /cards/:id` - Remove payment card (`Bearer JWT`).
- `GET /notifications` - Retrieve customer notifications (`Bearer JWT`).
- `PUT /notifications/mark-read` - Mark all notifications read (`Bearer JWT`).

### 👨‍🍳 Chef Portal (`/api/v1/chef`) - *Requires role: `chef` or `admin`*
- `GET /dashboard` - Kitchen metrics, sales figures, today's order count, active orders.
- `POST /kitchen/toggle` - Toggle kitchen open/closed status.
- `GET /orders` - Fetch kitchen preparation queue.
- `PUT /orders/:id/status` - Update dish preparation status (`preparing`, `onTheWay`).
- `GET /menu` - Fetch dishes managed by chef's restaurant.
- `POST /dishes` - Add new dish to restaurant menu.

### 🛵 Rider Portal (`/api/v1/rider`) - *Requires role: `rider` or `admin`*
- `GET /dashboard` - Rider metrics, earnings, completed trips, available/active delivery.
- `POST /online/toggle` - Toggle online dispatch readiness.
- `GET /deliveries` - Fetch open delivery requests.
- `PUT /deliveries/:id/accept` - Accept delivery request.
- `PUT /deliveries/:id/status` - Advance trip status (`onTheWay`, `delivered`).

---

## 🔒 Default Test Accounts

| Role | Email | Password |
|---|---|---|
| Customer | `jihanurrahman33@gmail.com` | `password123` |
| Chef | `chef@fooddelivery.com` | `password123` |
| Rider | `rider@fooddelivery.com` | `password123` |
| Admin | `admin@fooddelivery.com` | `password123` |
