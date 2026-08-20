# Osteria — Restaurant Management Dashboard

A full-stack restaurant management application with a RESTful API backend and a modern Next.js frontend dashboard. Built for managing restaurants, menu items, and daily operations from a single interface.

---

## Live Links

| Service | URL |
|---------|-----|
| Frontend (Vercel) | [https://osteria-dashboard.vercel.app](https://osteria-dashboard.vercel.app) |
| Backend API (Render) | [https://osteria-restaurant-app.onrender.com](https://osteria-restaurant-app.onrender.com) |

---

## Tech Stack

### Backend
- **Runtime:** Node.js + Express 5
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs
- **Environment:** dotenv
- **Dev Server:** nodemon

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + Tailwind CSS v4
- **Animations:** Framer Motion (motion)
- **Charts:** Recharts
- **Font:** DM Sans, DM Serif Display, DM Mono (Google Fonts)
- **State:** React Context API

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas (cloud)

---

## Features

### Authentication
- User registration with username, email, and password
- JWT-based login with token persistence (localStorage)
- Protected API routes via middleware
- Automatic auth gate on protected dashboard pages
- Logout with session cleanup

### Restaurant Management
- View all restaurants in a card grid layout
- Add new restaurants (name, city, address, cuisine, rating)
- Edit existing restaurant details
- Delete restaurants with confirmation
- Star rating display

### Menu Management
- Restaurant selector (switch between restaurants)
- View menu items per restaurant
- Add new menu items with name and price
- Edit menu item details
- Delete menu items with confirmation
- Toggle item availability (in-stock / out-of-stock)

### Dashboard
- Revenue analytics with area chart (Recharts)
- Popular items breakdown with horizontal bar chart
- Key stat cards (revenue, orders, guests, rating) with animated counters
- Recent orders table

### Orders & Activity
- Orders table with status badges (preparing, served, completed)
- Order filtering by status
- Mock data for orders (backend endpoints planned)

### Design System
- Custom terracotta color palette (50–950)
- Responsive sidebar with mobile hamburger menu
- Consistent card, badge, and button component classes
- Smooth page transitions and staggered animations
- DM Serif Display for headings, DM Sans for body text

---

## Project Structure

```
restaurant-Managment-API/
├── .env                          # Environment variables (PORT, MONGO_URI, JWT_SECRET)
├── server.js                     # Express entry point, CORS, route mounting
├── config/
│   └── db.js                     # MongoDB connection via Mongoose
├── controllers/
│   ├── authcontroller.js         # Register & login logic
│   ├── restaurantcontroller.js   # Restaurant CRUD operations
│   └── menucontroller.js         # Menu item CRUD operations
├── middleware/
│   └── auth.js                   # JWT verification middleware
├── models/
│   ├── users.js                  # User schema (username, email, password)
│   ├── restaurant.js             # Restaurant schema (name, city, address, cuisine, rating)
│   ├── menuitems.js              # MenuItem schema (name, price, isAvailable, restaurantId)
│   └── counter.js                # Auto-increment ID counter
├── router/
│   ├── authroutes.js             # POST /auth/register, POST /auth/login
│   ├── restaurantroutes.js       # GET/POST/PUT/DELETE /restaurants
│   └── menuroutes.js             # GET/POST/PUT/DELETE /restaurants/:id/menu
│
└── Frontend/
    ├── .env.local                # NEXT_PUBLIC_API_URL
    ├── package.json
    ├── next.config.ts
    ├── postcss.config.mjs
    ├── tsconfig.json
    └── src/
        ├── app/
        │   ├── layout.tsx            # Root layout (Google Fonts, ClientProviders)
        │   ├── globals.css           # Tailwind v4 @theme config, component classes
        │   ├── page.tsx              # Dashboard (stats, charts, recent orders)
        │   ├── login/page.tsx        # Login form (split-screen UI)
        │   ├── register/page.tsx     # Registration form (password strength)
        │   ├── menu/page.tsx         # Menu CRUD (connected to API)
        │   ├── orders/page.tsx       # Orders table (mock data)
        │   └── restaurants/page.tsx  # Restaurant CRUD (connected to API)
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.tsx       # Navigation sidebar (responsive)
        │   │   └── Header.tsx        # Page header with title and actions
        │   ├── ClientProviders.tsx   # Auth gate + context providers
        │   └── dashboard/
        │       ├── StatCard.tsx       # Animated stat cards
        │       ├── RevenueChart.tsx   # Area chart (Recharts)
        │       ├── PopularItems.tsx   # Bar chart (Recharts)
        │       └── RecentOrders.tsx   # Recent orders table
        ├── contexts/
        │   ├── AuthContext.tsx        # Auth state, login, register, logout
        │   └── RestaurantContext.tsx  # Restaurant & menu state, CRUD methods
        ├── lib/
        │   ├── api.ts                # HTTP client with JWT header injection
        │   └── utils.ts              # cn(), formatCurrency(), formatTime()
        └── data/
            └── mock.ts               # Mock data types & sample data
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| `POST` | `/auth/register` | `{ username, email, password }` | No | Register a new user |
| `POST` | `/auth/login` | `{ email, password }` | No | Login and receive JWT |

### Restaurants
| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| `GET` | `/restaurants` | — | No | Get all restaurants |
| `GET` | `/restaurants/:id` | — | No | Get restaurant by ID |
| `POST` | `/restaurants` | `{ name, city, address, cuisine, rating }` | Yes | Create a restaurant |
| `PUT` | `/restaurants/:id` | `{ name?, city?, address?, cuisine?, rating? }` | Yes | Update a restaurant |
| `DELETE` | `/restaurants/:id` | — | Yes | Delete a restaurant |

### Menu Items
| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| `GET` | `/restaurants/:id/menu` | — | No | Get menu for a restaurant |
| `POST` | `/restaurants/:id/menu` | `{ name, price, isAvailable? }` | Yes | Add a menu item |
| `PUT` | `/restaurants/menu/:id` | `{ name?, price?, isAvailable? }` | Yes | Update a menu item |
| `DELETE` | `/restaurants/menu/:id` | — | Yes | Delete a menu item |

> **Auth** = `Yes` requires `Authorization: Bearer <token>` header.

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/<your-username>/restaurant-Managment-API.git
cd restaurant-Managment-API

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm start
# Backend runs on http://localhost:3000
```

### Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3000

# Start development server
npm run dev
# Frontend runs on http://localhost:5000
```

### Environment Variables

**Backend `.env`**
```
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_secret_key
JWT_EXPIRE=1d
```

**Frontend `.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Deployment

### Backend (Render)
1. Push backend code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect the repository
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables (PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRE)
7. Deploy

### Frontend (Vercel)
1. Push frontend code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set root directory to `Frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL` = your Render backend URL
5. Deploy

### Post-Deployment
- Update backend CORS `origin` array to include your Vercel URL
- Ensure MongoDB Atlas IP whitelist allows all IPs (`0.0.0.0/0`)

---

## Database Schema

### User
| Field | Type | Required |
|-------|------|----------|
| `_id` | Number (auto-increment) | Yes |
| `username` | String | Yes |
| `email` | String (unique) | Yes |
| `password` | String (hashed) | Yes |
| `createdAt` | Date | Auto |

### Restaurant
| Field | Type | Required |
|-------|------|----------|
| `_id` | Number (auto-increment) | Yes |
| `name` | String | Yes |
| `city` | String | Yes |
| `address` | String | Yes |
| `cuisine` | String | Yes |
| `rating` | Number | No |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

### MenuItem
| Field | Type | Required |
|-------|------|----------|
| `_id` | Number (auto-increment) | Yes |
| `restaurantId` | Number | Yes |
| `name` | String | Yes |
| `price` | Number | Yes |
| `isAvailable` | Boolean | No (default: true) |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start backend with nodemon |
| `npm run dev` | Start frontend dev server (port 5000) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

---

## License

This project is for educational purposes.
