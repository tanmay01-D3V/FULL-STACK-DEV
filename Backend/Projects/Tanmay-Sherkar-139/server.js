require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const { swaggerSpec } = require('./Config/swagger');
const logger = require('./middleware/logger');
const { apiLimiter } = require('./middleware/rateLimmiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routers/authRoutes');
const userRoutes = require('./routers/userRoute');
const { bookRouter, transactionRouter } = require('./routers/bookRoutes');

const app = express();

const PORT = process.env.PORT || 5000;


app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 

app.use(logger);

app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Library Management API',
    docs: `/api-docs`,
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/app', express.static(path.join(__dirname, 'src')));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Library Management API running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;