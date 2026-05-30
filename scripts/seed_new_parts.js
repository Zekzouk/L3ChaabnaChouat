require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const newCategories = [
    "Engine", "Brakes", "Cooling & A/C", "Electrical & Lighting", "Body Parts", 
    "Suspension & Steering", "Transmission", "Fuel & Air", "Wheels & Tires", 
    "Interior", "Hoses & Hardware", "Tools & Fluids"
];

const brands = ["Bosch", "Valeo", "NGK", "Brembo", "Denso", "Mann-Filter", "Michelin", "Hella", "LuK", "Delphi"];
const models = ["Peugeot 208", "Renault Clio", "Volkswagen Golf", "Hyundai Tucson", "Toyota Hilux", "Seat Ibiza", "Dacia Logan", "Skoda Octavia"];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sayarati');
        console.log('✅ Connected to MongoDB.');

        let seller = await User.findOne({ role: 'seller' });
        if (!seller) {
            seller = await User.create({
                name: 'AutoParts DZ',
                email: 'seller@autoparts.dz',
                password: 'hashed_password', 
                phone: '0555123456',
                wilaya: '16 - Alger',
                role: 'seller',
                status: 'active',
                shopName: 'AutoParts DZ'
            });
            console.log('Created dummy seller account.');
        }

        await Product.deleteMany({});
        console.log('🗑️ Deleted all old products.');

        const productsToInsert = [];
        for (let i = 1; i <= 50; i++) {
            const category = getRandomItem(newCategories);
            const brand = getRandomItem(brands);
            const carModel = getRandomItem(models);
            
            const titles = [
                `Premium ${category} for ${carModel}`,
                `Original ${brand} ${category}`,
                `Replacement ${category} - ${carModel}`,
                `High Quality ${category} (${brand})`,
                `${brand} ${category} Kit`
            ];

            const conditions = ['new', 'used'];
            const authenticities = ['original', 'fake'];

            productsToInsert.push({
                title: getRandomItem(titles),
                description: `High-quality automotive part. Perfect fit for your vehicle. Brand: ${brand}. Compatible with: ${carModel}. Category: ${category}. Excellent durability and performance.`,
                price: Math.floor(Math.random() * 45000) + 1500, 
                condition: getRandomItem(conditions),
                authenticity: getRandomItem(authenticities),
                reference: `REF-${Math.floor(Math.random() * 1000000)}`,
                category: category,
                brand: brand,
                carModel: carModel,
                seller: seller._id,
                images: [`https://placehold.co/600x400/1a2942/ffffff?text=${encodeURIComponent(category)}\n${brand}`],
                status: 'active'
            });
        }

        await Product.insertMany(productsToInsert);
        console.log(`✅ Successfully seeded 50 new products using the new categories!`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedProducts();
