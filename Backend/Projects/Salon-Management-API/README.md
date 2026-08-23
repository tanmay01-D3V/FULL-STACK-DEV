# Glow & Grace — Salon Management System

Full-stack salon management app — React frontend consuming an Express + Supabase REST API with JWT auth.

**Live:** https://glow-and-grace-salon.vercel.app

## Project structure

```
Salon-Management-API/
├── Backend/    Express REST API (JWT auth + Supabase)
└── Frontend/   React 19 + Vite SPA (Tailwind, React Router v6)
```

## Backend (`Backend/`)

Node.js + Express + Supabase. Env vars in `Backend/.env`: `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`.

```bash
cd Backend
npm install
npm start        # http://localhost:3000
```

### API endpoints

- `POST /auth/signup` — `{name, email, password}`
- `POST /auth/login` — `{email, password}` → `{token, user}`
- `GET /services` — `{count, data[]}`
- `GET /services/:id` — `{data}`
- `POST /services` *(auth)* — `{name, price, description?, duration_minutes?}`
- `PUT /services/:id` *(auth)* — partial fields
- `DELETE /services/:id` *(auth)*

## Frontend (`Frontend/`)

### Stack

- React 19 (Vite), JavaScript
- React Router v6 — routing + protected routes
- Axios — instance with JWT request interceptor + 401 auto-logout redirect
- Context API — auth state (`AuthContext` / `useAuth`)
- Tailwind CSS v4 — blush/plum salon theme
- React Hook Form + Yup — validated forms
- react-hot-toast — notifications
- GSAP + ScrollTrigger — hero entrance timeline, parallax and scroll reveals

### Getting started

```bash
cd Frontend
cp .env.example .env   # set VITE_API_URL if not http://localhost:3000
npm install
npm run dev            # http://localhost:5173
npm run build          # production build → dist/
```

Deployed on Vercel; set `VITE_API_URL` as a build-time environment variable there.

### Routes

| Path | Access | Description |
|---|---|---|
| `/` | public | Landing page, animated hero + featured treatments |
| `/services` | public | Service grid with search + sort; "Add service" when logged in |
| `/services/new` | protected | Create a service |
| `/services/:id` | public | Detail page; Edit/Delete when logged in |
| `/services/:id/edit` | protected | Edit a service |
| `/login`, `/register` | public | Auth pages |

## Auth flow

JWT is stored in `localStorage` (`salon_token` / `salon_user`) and attached as
`Authorization: Bearer <token>` to every request via an Axios interceptor.
A 401 from any non-auth call clears the session and redirects to `/login?expired=1`.
