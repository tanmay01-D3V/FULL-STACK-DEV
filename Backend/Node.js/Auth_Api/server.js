const express = require('express');
const db = require('./config/db');
const userRoutes = require('./routes/user_routes');
const authmiddleware = require('./middleware/authmiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});