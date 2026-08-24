const express = require('express');
const employeeRouter = require('./router/employeeRouter');
const db = require('./config/db');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use('/employees', employeeRouter);

app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON format in request body' });
    }
    if (err.type === 'entity.parse.failed' || err.type === 'entity.too.large') {
        return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})