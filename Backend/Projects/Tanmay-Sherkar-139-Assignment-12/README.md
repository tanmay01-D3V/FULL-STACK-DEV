# 🎟️ Assignment 12: Event Management & Ticketing API with Firebase & Swagger

> **Track:** Backend Development | **Level:** Advanced | **Student:** Tanmay Sherkar  
> **Tech Stack:** Node.js, Express.js, Firebase Firestore & Auth, jsonwebtoken, bcryptjs, express-rate-limit, swagger-ui-express, swagger-jsdoc, dotenv, cors

---

## 📌 1. Objective & Architecture Overview

A high-concurrency **Event Ticketing & Live Booking REST API** backed by **Google Firebase Firestore**, secured with **JWT Role-Based Access Control** (`Organizer` vs `Attendee`), hardened with **API Rate Limiting** to prevent ticket-scalping bots, and documented comprehensively with **Swagger OpenAPI 3.0**.

### Key Architectural Highlights:
- **Firestore ACID Transactions (`runTransaction`)**: Enforces atomic updates when purchasing or cancelling tickets. Guarantees ticket inventory never oversells or drops below 0 even under heavy concurrent traffic.
- **Role-Based Access Control (RBAC)**: Enforced via `auth.js` and `checkRole.js` (`Organizer` creates/updates/cancels events & views attendee rosters; `Attendee` books/cancels tickets and views purchase history).
- **Anti-Scalper Rate Limiter**: Maximum 10 booking requests per minute per IP using `express-rate-limit` on `/api/tickets/book`.
- **Interactive Swagger Documentation**: Live interactive OpenAPI 3.0 UI rendered via `swagger-ui-express` at `/api-docs`.
- **Firestore Initialization**: Seamlessly connects to live Google Cloud Firestore when `serviceAccountKey.json` is supplied, with an automatic in-memory ACID transaction fallback for offline grading and instant testing.

---

## 🏗️ 2. Project Directory Structure

```text
Tanmay-Sherkar-139-Assignment-12/
├── config/
│   ├── firebaseConfig.js    # Firebase Admin Firestore init & transaction engine
│   └── swagger.js           # Swagger OpenAPI 3.0 specification & JSDoc config
├── controllers/
│   ├── authController.js     # User registration, login & JWT generation
│   ├── eventController.js    # CRUD for events & attendee roster
│   └── ticketController.js   # Atomic transactional booking & cancellation logic
├── middleware/
│   ├── auth.js              # Bearer JWT verification
│   ├── checkRole.js         # Organizer vs Attendee guard
│   └── rateLimiter.js       # Strict booking rate limit (10 req/min)
├── routes/
│   ├── authRoutes.js        # /api/auth routes
│   ├── eventRoutes.js       # /api/events routes
│   └── ticketRoutes.js      # /api/tickets routes
├── serviceAccountKey.json.example # Template for Firebase service account
├── .env.example             # Environment variable template
├── .env                     # Local configuration
├── .gitignore               # Excludes secrets & node_modules
├── package.json
├── server.js                # Express server bootstrap
├── test-concurrency.js      # Automated concurrency race condition test
└── README.md
```

---

## 🗄️ 3. Firestore Document Schema

### 1. `events` Collection
```json
{
  "id": "event_techconf_2026",
  "title": "Global Cloud & AI Summit 2026",
  "description": "Annual flagship backend conference",
  "category": "Technology",
  "eventDate": "2026-06-15T09:00:00Z",
  "venue": "Bandra Kurla Complex, Mumbai",
  "organizerId": "usr_organizer_01",
  "ticketPrice": 1499,
  "totalCapacity": 500,
  "availableTickets": 482,
  "createdAt": "2026-03-01T12:00:00Z"
}
```

### 2. `tickets` Collection
```json
{
  "id": "ticket_rec_88219",
  "eventId": "event_techconf_2026",
  "eventTitle": "Global Cloud & AI Summit 2026",
  "userId": "usr_attendee_99",
  "attendeeName": "Kunal Sharma",
  "attendeeEmail": "kunal@gmail.com",
  "quantity": 2,
  "totalPaid": 2998,
  "bookingRef": "TKT-2026-88219",
  "status": "confirmed",
  "bookedAt": "2026-03-02T16:20:00Z"
}
```

### 3. `users` Collection
```json
{
  "id": "usr_organizer_01",
  "name": "Tanmay Sherkar",
  "email": "organizer@example.com",
  "password": "$2a$10$hashedPassword...",
  "role": "Organizer",
  "createdAt": "2026-03-01T10:00:00.000Z"
}
```

---

## 📋 4. API Endpoints Specification

### 🔐 Authentication

| Method | Endpoint | Role Access | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/register` | Public | Register as `Attendee` or `Organizer` |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT token |
| `GET` | `/api/auth/profile` | Authenticated | Retrieve user profile & role |

### 🎪 Event Management

| Method | Endpoint | Role Access | Description |
|---|---|:---:|---|
| `GET` | `/api/events` | Public | Browse all upcoming events (supports `?category=Technology&city=Mumbai`) |
| `GET` | `/api/events/:id` | Public | View event details & live remaining ticket count |
| `POST` | `/api/events` | **Organizer** | Create new event listing |
| `PUT` | `/api/events/:id` | **Organizer** | Update event details (Organizer must own event) |
| `DELETE` | `/api/events/:id` | **Organizer** | Cancel and delete event |
| `GET` | `/api/events/:id/attendees` | **Organizer** | List all registered attendees for the event |

### 🎟️ Ticket Booking & Scalper Protection

| Method | Endpoint | Role Access | Description |
|---|---|:---:|---|
| `POST` | `/api/tickets/book` | **Attendee** | **Atomic Booking**: 10 requests / min limit. Decrements tickets via transaction |
| `GET` | `/api/tickets/my-tickets` | **Attendee** | View purchased tickets |
| `POST` | `/api/tickets/:id/cancel` | **Attendee** | Cancel ticket & restore ticket inventory |

### 📚 Interactive Swagger Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api-docs` | Full interactive Swagger UI documentation for all endpoints |

---

## ⚡ 5. Firestore Concurrency Transaction Implementation

```javascript
// controllers/ticketController.js
const { db } = require('../config/firebaseConfig');

exports.bookTicket = async (req, res) => {
  const { eventId, quantity, attendeeName, attendeeEmail } = req.body;
  const userId = req.user.id;
  const qty = parseInt(quantity, 10);

  const eventRef = db.collection('events').doc(eventId);
  const ticketRef = db.collection('tickets').doc();

  try {
    const result = await db.runTransaction(async (t) => {
      const eventDoc = await t.get(eventRef);
      if (!eventDoc.exists) {
        throw new Error('Event not found');
      }

      const eventData = eventDoc.data();
      if (eventData.availableTickets < qty) {
        throw new Error(`Insufficient tickets available. Requested: ${qty}, Remaining: ${eventData.availableTickets}`);
      }

      // 1. Atomically decrement available tickets in event document
      t.update(eventRef, {
        availableTickets: eventData.availableTickets - qty
      });

      // 2. Create confirmed ticket document
      const bookingRef = `TKT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const newTicket = {
        id: ticketRef.id,
        eventId,
        eventTitle: eventData.title,
        userId,
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.trim().toLowerCase(),
        quantity: qty,
        totalPaid: qty * eventData.ticketPrice,
        bookingRef,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      };

      t.set(ticketRef, newTicket);
      return newTicket;
    });

    res.status(201).json({ success: true, message: 'Tickets booked successfully', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
```

---

## 🚀 6. Setup & Running Instructions

### 1. Install Dependencies
```bash
cd Tanmay-Sherkar-139-Assignment-12
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_key_assignment_12_secure_token
JWT_EXPIRES_IN=7d
```

### 3. (Optional) Connect to Live Firebase Firestore
Download your `serviceAccountKey.json` from the Firebase Console (*Project Settings ➔ Service Accounts ➔ Generate new private key*) and place it in the project root. If omitted, the server automatically runs in zero-config In-Memory Firestore mode.

### 4. Start the Server
```bash
# Development mode with Nodemon auto-restart
npm run dev

# Or production mode
npm start
```

### 5. Access Interactive Swagger Docs
Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

---

## 🧪 7. Automated Concurrency & Rate Limiting Test

Run the built-in automated concurrency verification script:
```bash
npm run test:concurrency
```
This script:
1. Registers an `Organizer` and creates an event with `totalCapacity = 5`.
2. Registers an `Attendee` and executes 8 simultaneous booking requests.
3. Verifies that exactly 5 requests succeed, 3 are safely rejected with `Insufficient tickets available`, and `availableTickets` never drops below 0.
4. Confirms that attempting > 10 requests within a 60-second window triggers HTTP `429 Too Many Requests`.
