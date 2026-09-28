const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { generalApiLimiter } = require('./middleware/rateLimiter');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalApiLimiter);

// Interactive Swagger UI documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { background-color: #1a202c; }',
    customSiteTitle: 'Event Management & Ticketing API Docs'
  })
);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);

// Root Route & Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Event Management & Ticketing API',
    version: '1.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      events: {
        list: 'GET /api/events',
        details: 'GET /api/events/:id',
        create: 'POST /api/events',
        update: 'PUT /api/events/:id',
        delete: 'DELETE /api/events/:id',
        attendees: 'GET /api/events/:id/attendees'
      },
      tickets: {
        book: 'POST /api/tickets/book (Rate Limited: 10/min, Atomic Transaction)',
        myTickets: 'GET /api/tickets/my-tickets',
        cancel: 'POST /api/tickets/:id/cancel (Atomic Inventory Restoral)'
      }
    }
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Event Ticketing Server running on port ${PORT}`);
    console.log(`📚 Interactive Swagger UI: http://localhost:${PORT}/api-docs`);
    console.log(`⚡ Concurrency Protection: Firestore runTransaction enabled`);
    console.log(`🛡️ Rate Limiting: 10 booking requests/min enabled`);
    console.log(`====================================================`);
  });
}

module.exports = app;
