const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config(); 

async function initAdmin() {
    try {
        const uri = process.env.MONGODB_URI;        await mongoose.connect(uri);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@CarFix.com';
        await User.deleteOne({ email: adminEmail }); 

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new User({
            name: 'المدير العام',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('--- ADMIN ACCOUNT CREATED ---');
        console.log('Email: admin@CarFix.com');
        console.log('Password: admin123');
        console.log('-----------------------------');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
}

initAdmin();
