# Glow & Grace — Salon Management Frontend

React + Vite frontend for the Salon Management API (Express + Supabase, JWT auth).

## Stack

- React 19 (Vite), JavaScript
- React Router v6 — routing + protected routes
- Axios — instance with JWT request interceptor + 401 auto-logout redirect
- Context API — auth state (`AuthContext` / `useAuth`)
- Tailwind CSS v4 — blush/plum salon theme
- React Hook Form + Yup — validated forms
- react-hot-toast — notifications

## Getting started

```bash
cp .env.example .env   # set VITE_API_URL if not http://localhost:3000
npm install
npm run dev            # http://localhost:5173
npm run build          # production build → dist/
```

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | public | Landing page, hero + featured treatments |
| `/services` | public | Service grid with search + sort; "Add service" when logged in |
| `/services/new` | protected | Create a service |
| `/services/:id` | public | Detail page; Edit/Delete when logged in |
| `/services/:id/edit` | protected | Edit a service |
| `/login`, `/register` | public | Auth pages |

## Backend contract used

- `POST /auth/signup` — `{name, email, password}`
- `POST /auth/login` — `{email, password}` → `{token, user}`
- `GET /services` — `{count, data[]}`
- `GET /services/:id` — `{data}`
- `POST /services` *(auth)* — `{name, price, description?, duration_minutes?}`
- `PUT /services/:id` *(auth)* — partial fields
- `DELETE /services/:id` *(auth)*

JWT is stored in `localStorage` (`salon_token` / `salon_user`) and attached as
`Authorization: Bearer <token>` to every request. A 401 from any non-auth call
clears the session and redirects to `/login?expired=1`.
