const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const { PARTS } = require('../scripts/seed-products');

async function autoInitializeDatabase() {
    try {
        
        const adminEmail = 'admin@CarFix.com';
        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
            console.log('⏳ Auto-creating admin account...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            const admin = new User({
                name: 'المدير العام',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Default admin account created (admin@CarFix.com / admin123).');
        }

const sellerEmail = 'demo-seller@CarFix.com';
        let seller = await User.findOne({ email: sellerEmail });
        if (!seller) {
            console.log('⏳ Auto-creating demo seller account...');
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash('seller123', salt);
            seller = new User({
                name: 'متجر CarFix التجريبي',
                shopName: 'CarFix Demo Shop',
                email: sellerEmail,
                password: hashed,
                role: 'seller',
                status: 'active',
                wilaya: 'Alger'
            });
            await seller.save();
            console.log('✅ Demo seller account created (demo-seller@CarFix.com / seller123).');
        }

const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('⏳ Database is empty. Seeding 25 products...');
            const docs = PARTS.map(p => ({ ...p, seller: seller._id, status: 'active' }));
            await Product.insertMany(docs);
            console.log('✅ Successfully seeded 25 products with real images.');
        }
    } catch (err) {
        console.error('❌ Auto-initialization warning:', err.message);
    }
}

module.exports = autoInitializeDatabase;
