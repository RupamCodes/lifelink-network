require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Mount routes
app.use('/api/donors', require('./routes/donors'));
app.use('/api/blood', require('./routes/blood'));
app.use('/api/organs', require('./routes/organs'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api', require('./routes/matching'));
app.use('/api/allocations', require('./routes/allocations'));
app.use('/api/alerts', require('./routes/alerts'));

// Fallback route for SPA
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
