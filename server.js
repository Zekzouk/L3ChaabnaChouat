require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const autoInitializeDatabase = require('./utils/dbInit');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB successfully.');
        await autoInitializeDatabase();
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error. Please make sure MongoDB is running.');
        console.error(err.message);
    });

const User = require('./models/User');
const Product = require('./models/Product');
const ShopRequest = require('./models/ShopRequest');
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/orders'));

app.get('/api/status', (req, res) => {
    res.json({
        status: 'success',
        message: 'SAYARATI API is running!',
        timestamp: new Date()
    });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error('🔥 UNHANDLED ERROR:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message, stack: err.stack });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

