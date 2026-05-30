const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const categories = [
    { name: 'أجزاء المحرك', items: ['فلتر زيت', 'مضخة ماء', 'طقم جوانات', 'شمعات احتراق (Bougies)', 'تيربو'] },
    { name: 'كهرباء وإضاءة', items: ['بطارية 70Ah', 'دينامو', 'أضواء أمامية LED', 'حساس ركن', 'كمبيوتر سيارة'] },
    { name: 'أنظمة الفرامل', items: ['صفائح فرامل (Plaquettes)', 'ديسك فرامل', 'مضخة فرامل', 'ABS Sensor'] },
    { name: 'نظام التعليق', items: ['مساعدات (Amortisseurs)', 'كريميار', 'طقم جلود', 'سوبرات'] },
    { name: 'نظام التبريد', items: ['رادياتير', 'مروحة تبريد', 'تيرموستا', 'خزان ماء'] },
    { name: 'إكسسوارات زينة', items: ['أغطية مقاعد', 'سجاد أرضية', 'عطر سيارة', 'شاشة أندرويد'] }
];

const conditions = ['new', 'used'];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        let seller = await User.findOne({ role: 'seller' });
        if (!seller) {

            seller = await User.findOne({ role: 'admin' });
        }

        if (!seller) {
            console.error('No seller or admin found to assign products to. Please register a user first.');
            process.exit(1);
        }

        console.log(`Seeding 30 products for seller: ${seller.email}`);

        const newProducts = [];

        for (let i = 1; i <= 30; i++) {
            const catObj = categories[Math.floor(Math.random() * categories.length)];
            const titlePrefix = catObj.items[Math.floor(Math.random() * catObj.items.length)];
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            
            newProducts.push({
                title: `${titlePrefix} - قطعة رقم ${i}`,
                description: `وصف تفصيلي للمنتج رقم ${i}. هذه القطعة بجودة عالية ومتوافقة مع العديد من موديلات السيارات.`,
                price: Math.floor(Math.random() * (50000 - 1500) + 1500),
                category: catObj.name,
                condition: condition,
                images: [`/uploads/placeholder.webp`],
                seller: seller._id,
                status: 'active'
            });
        }

        await Product.insertMany(newProducts);
        console.log('--- 30 PRODUCTS SEEDED SUCCESSFULLY ---');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding products:', err.message);
        process.exit(1);
    }
}

seedProducts();
