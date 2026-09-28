const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🎟️ Event Management & Ticketing API',
      version: '1.0.0',
      description: `
High-concurrency **Event Ticketing & Live Booking REST API** backed by **Google Firebase Firestore**, secured with **JWT Role-Based Access Control** (\`Organizer\` vs \`Attendee\`), hardened with **API Rate Limiting** to prevent ticket-scalping bots, and documented comprehensively with **Swagger OpenAPI 3.0**.

### Key Architectural Highlights:
- **Firestore ACID Transactions (\`runTransaction\`)**: Prevents ticket overselling under high concurrency.
- **Role-Based Access Control**: \`Organizer\` manages event listings; \`Attendee\` purchases and cancels tickets.
- **Anti-Scalper Rate Limiter**: Maximum 10 requests / minute on ticket booking routes.
- **RESTful Endpoints & Schema Validation**.
      `,
      contact: {
        name: 'Tanmay Sherkar',
        email: 'tanmay@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token (without Bearer prefix) obtained from /api/auth/login or /api/auth/register'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'usr_attendee_99' },
            name: { type: 'string', example: 'Kunal Sharma' },
            email: { type: 'string', format: 'email', example: 'kunal@gmail.com' },
            role: { type: 'string', enum: ['Attendee', 'Organizer'], example: 'Attendee' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-03-01T10:00:00.000Z' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: { type: 'string', example: 'Kunal Sharma' },
            email: { type: 'string', format: 'email', example: 'kunal@gmail.com' },
            password: { type: 'string', format: 'password', example: 'SecurePassword123!' },
            role: { type: 'string', enum: ['Attendee', 'Organizer'], example: 'Attendee' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'kunal@gmail.com' },
            password: { type: 'string', format: 'password', example: 'SecurePassword123!' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Authentication successful' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'event_techconf_2026' },
            title: { type: 'string', example: 'Global Cloud & AI Summit 2026' },
            description: { type: 'string', example: 'Annual flagship backend conference' },
            category: { type: 'string', example: 'Technology' },
            eventDate: { type: 'string', format: 'date-time', example: '2026-06-15T09:00:00Z' },
            venue: { type: 'string', example: 'Bandra Kurla Complex, Mumbai' },
            organizerId: { type: 'string', example: 'usr_organizer_01' },
            ticketPrice: { type: 'number', example: 1499 },
            totalCapacity: { type: 'integer', example: 500 },
            availableTickets: { type: 'integer', example: 482 },
            createdAt: { type: 'string', format: 'date-time', example: '2026-03-01T12:00:00Z' }
          }
        },
        CreateEventRequest: {
          type: 'object',
          required: ['title', 'description', 'category', 'eventDate', 'venue', 'ticketPrice', 'totalCapacity'],
          properties: {
            title: { type: 'string', example: 'Global Cloud & AI Summit 2026' },
            description: { type: 'string', example: 'Annual flagship backend conference' },
            category: { type: 'string', example: 'Technology' },
            eventDate: { type: 'string', format: 'date-time', example: '2026-06-15T09:00:00Z' },
            venue: { type: 'string', example: 'Bandra Kurla Complex, Mumbai' },
            ticketPrice: { type: 'number', example: 1499 },
            totalCapacity: { type: 'integer', example: 500 }
          }
        },
        UpdateEventRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Global Cloud & AI Summit 2026 - Extended' },
            description: { type: 'string', example: 'Updated keynote speakers lineup' },
            category: { type: 'string', example: 'Technology' },
            eventDate: { type: 'string', format: 'date-time', example: '2026-06-16T09:00:00Z' },
            venue: { type: 'string', example: 'Nesco Center, Mumbai' },
            ticketPrice: { type: 'number', example: 1599 }
          }
        },
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'ticket_rec_88219' },
            eventId: { type: 'string', example: 'event_techconf_2026' },
            eventTitle: { type: 'string', example: 'Global Cloud & AI Summit 2026' },
            userId: { type: 'string', example: 'usr_attendee_99' },
            attendeeName: { type: 'string', example: 'Kunal Sharma' },
            attendeeEmail: { type: 'string', example: 'kunal@gmail.com' },
            quantity: { type: 'integer', example: 2 },
            totalPaid: { type: 'number', example: 2998 },
            bookingRef: { type: 'string', example: 'TKT-2026-88219' },
            status: { type: 'string', enum: ['confirmed', 'cancelled'], example: 'confirmed' },
            bookedAt: { type: 'string', format: 'date-time', example: '2026-03-02T16:20:00Z' }
          }
        },
        BookTicketRequest: {
          type: 'object',
          required: ['eventId', 'quantity', 'attendeeName', 'attendeeEmail'],
          properties: {
            eventId: { type: 'string', example: 'event_techconf_2026' },
            quantity: { type: 'integer', minimum: 1, example: 2 },
            attendeeName: { type: 'string', example: 'Kunal Sharma' },
            attendeeEmail: { type: 'string', format: 'email', example: 'kunal@gmail.com' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found or unauthorized' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
