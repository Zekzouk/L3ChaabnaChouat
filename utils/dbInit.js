const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const { PARTS } = require('../scripts/seed-products');

async function autoInitializeDatabase() {
    try {
        // 1. Check if admin user exists
        const adminEmail = 'admin@sayarati.com';
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
            console.log('✅ Default admin account created (admin@sayarati.com / admin123).');
        }

        // 2. Check if demo seller exists
        const sellerEmail = 'demo-seller@sayarati.com';
        let seller = await User.findOne({ email: sellerEmail });
        if (!seller) {
            console.log('⏳ Auto-creating demo seller account...');
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash('seller123', salt);
            seller = new User({
                name: 'متجر سيارتي التجريبي',
                shopName: 'SAYARATI Demo Shop',
                email: sellerEmail,
                password: hashed,
                role: 'seller',
                status: 'active',
                wilaya: 'Alger'
            });
            await seller.save();
            console.log('✅ Demo seller account created (demo-seller@sayarati.com / seller123).');
        }

        // 3. Check if products exist
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
