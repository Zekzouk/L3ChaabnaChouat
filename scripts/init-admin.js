const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config(); 

async function initAdmin() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://ZakiMazen:Sayarati123@ac-qnqz41b-shard-00-00.v3rtsbu.mongodb.net:27017,ac-qnqz41b-shard-00-01.v3rtsbu.mongodb.net:27017,ac-qnqz41b-shard-00-02.v3rtsbu.mongodb.net:27017/sayarati?ssl=true&replicaSet=atlas-z0j7w5-shard-0&authSource=admin&appName=Cluster0';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@sayarati.com';
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
        console.log('Email: admin@sayarati.com');
        console.log('Password: admin123');
        console.log('-----------------------------');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
}

initAdmin();
