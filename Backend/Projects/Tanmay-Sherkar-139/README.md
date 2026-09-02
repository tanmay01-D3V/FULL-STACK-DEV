# Library Management System API

A complete Library Management System — Express REST API backed by **Cloud Firestore** (Firebase Admin SDK), with a hand-rolled static frontend ("Circulation Desk") for browsing the catalog, borrowing/returning books, and admin management of borrowers.

## 🔗 Live Links

| App | URL |
| --- | --- |
| 🌐 Frontend (Circulation Desk) | https://full-stack-dev-8zwj.vercel.app |

## ✨ Features

- 🔐 **Custom JWT auth** — register, login, and role-based access (`student` / `librarian`)
- 📖 **Catalog** — search books by title/author, filter by availability, manage copies
- 🔁 **Circulation** — borrow and return books using Firestore transactions; overdue tracking
- 👥 **Borrower management** — librarians can view users, change roles, and remove accounts
- 🧾 **Ledger** — per-user loan history and a full circulation ledger
- 📑 **Swagger docs** — interactive API documentation
- 🚀 **Deploy-ready** — env-var-based Firebase credentials for Render/Heroku, Vercel static frontend

## 🛠 Tech Stack

- **Backend:** Node.js, Express, Firebase Admin SDK, Firestore, JWT, bcrypt
- **Frontend:** Vanilla HTML/CSS/JS (no framework, no build step)
- **Deployment:** Render (API), Vercel (static site)

## 📁 Project Structure

```
.
├── server.js              # Express entry point
├── Config/
│   ├── firebase.js        # Firebase Admin SDK init (env-based credentials)
│   └── swagger.js         # Swagger spec setup
├── controller/            # Auth, book, user request handlers
├── middleware/            # auth, role, errorHandler, logger, rate limiter, validator
├── models/                # Firestore data-access layer (users, books, transactions)
├── routers/               # Express route definitions
├── utils/                 # JWT helpers, validation rules, ApiError
├── docs/                  # Swagger YAML documentation
└── src/                   # Static frontend (index.html, style.css, app.js)
```

## 🚀 Local Development

### Prerequisites

- Node.js 16+
- A Firebase project with Cloud Firestore
- A Firebase **service account** JSON file

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file
cp .env.example .env

# 3. Add the Firebase service account
#    Either set GOOGLE_APPLICATION_CREDENTIALS to a local JSON path,
#    or paste the raw JSON into FIREBASE_SERVICE_ACCOUNT (takes precedence).

# 4. Start the server
npm run dev        # development (nodemon)
npm start          # production
```

The API runs at `http://localhost:5001` (or whichever `PORT` you set). Swagger docs: `http://localhost:5001/api-docs`.

### Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `PORT` | Server port (default `5000`) | optional |
| `NODE_ENV` | `development` / `production` | optional |
| `JWT_SECRET` | Secret used to sign auth tokens | ✅ |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1d` (default `1d`) | optional |
| `FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service-account JSON (local only) | or `FIREBASE_SERVICE_ACCOUNT` |
| `FIREBASE_SERVICE_ACCOUNT` | Full service-account JSON (preferred on Render/Heroku) | or `GOOGLE_APPLICATION_CREDENTIALS` |
| `BORROW_DURATION_DAYS` | Loan duration in days (default `14`) | optional |

> **Deploying credentials:** on Render/Heroku the service-account file is not committed (it's gitignored). Paste the **entire** contents of `library-secret.json` into the `FIREBASE_SERVICE_ACCOUNT` env var as a single-line JSON string.

## 🔌 API Endpoints

Base URL: `https://full-stack-dev-1.onrender.com/api`

### Auth — `/api/auth`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/auth/register` | Create an account | public |
| POST | `/auth/login` | Sign in, get a JWT | public |
| GET | `/auth/profile` | Current user profile | authenticated |
| PUT | `/auth/profile` | Update profile | authenticated |

### Books — `/api/books`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/books` | List books | authenticated |
| GET | `/books/search?q=` | Search by title/author | authenticated |
| GET | `/books/:id` | Book details | authenticated |
| POST | `/books` | Add a book | librarian |
| PUT | `/books/:id` | Update a book | librarian |
| DELETE | `/books/:id` | Remove a book | librarian |
| POST | `/books/:id/borrow` | Borrow a book | student |
| POST | `/books/:id/return` | Return a book | student |

### Transactions — `/api/transactions`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/transactions` | Full circulation ledger | librarian |
| GET | `/transactions/my` | Current user's loans | authenticated |

### Users — `/api/users`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/users` | List borrowers | librarian |
| GET | `/users/:id` | Borrower details | librarian |
| PUT | `/users/:id/role` | Update a user's role | librarian |
| DELETE | `/users/:id` | Remove a user | librarian |

All protected endpoints require the header: `Authorization: Bearer <token>`.

## ☁️ Deployment

### Backend → Render

1. Push the repo to GitHub and import it in Render as a **Web Service**.
2. Set the **Root Directory** to `Backend/Projects/Tanmay-Sherkar-139` (if running from a monorepo), build command `npm install`, start command `npm start`.
3. Add the env vars listed above — use `FIREBASE_SERVICE_ACCOUNT` with the raw JSON. **Do not** set `GOOGLE_APPLICATION_CREDENTIALS` (the file isn't deployed).
4. Add a health check on `/health` (Render pings this to keep the service warm).

### Frontend → Vercel

1. The `src/` folder is a pure static site — no build step.
2. In Vercel, import this GitHub repo and set the **Root Directory** to `Backend/Projects/Tanmay-Sherkar-139/src`, Framework Preset **Other**.
3. `src/vercel.json` rewrites `/api/*` to the Render backend, so the browser hits the API same-origin (no CORS issues):

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://full-stack-dev-1.onrender.com/api/$1" }
  ]
}
```

## 🔒 Security Notes

- Passwords are hashed with **bcrypt**; auth uses short-lived signed **JWTs**.
- Role middleware guards librarian-only actions.
- Rate limiting is applied on auth and `/api` routes.
- Firestore writes for borrow/return run in **transactions** to prevent double-borrowing.
- Replace the default `JWT_SECRET` with a strong random value in production.

## 📝 License

MIT — free to use and modify.