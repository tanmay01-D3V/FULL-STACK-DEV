# Interviewly

An interview scheduling system with JWT authentication, recruiter-owned slots, candidate booking, and overlap protection for both sides of the schedule.

## Run locally

1. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies in both `server` and `client`.
3. Start the API with `npm run dev` inside `server`.
4. Start the React app with `npm run dev` inside `client`.

The API runs on `http://localhost:5000` and the client on `http://localhost:5173`.

MongoDB Atlas is recommended because booking transactions require a replica set. The API also works with a local MongoDB for slot publishing and browsing.

## API highlights

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/slots`, `POST /api/slots` (recruiter)
- `POST /api/slots/:id/book` (candidate)
- `PATCH /api/slots/:id`, `DELETE /api/slots/:id` (slot owner)
- `GET /api/slots/mine` (authenticated user)

Import `postman/Interviewly.postman_collection.json` into Postman or Thunder Client.

