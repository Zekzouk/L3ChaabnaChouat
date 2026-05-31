const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, condition, brand, carModel, sort } = req.query;
        let query = { status: 'active' };

        if (search && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
                { reference: searchRegex }
            ];
        }

        ['category', 'condition', 'authenticity', 'brand', 'carModel'].forEach(key => {
            if (req.query[key] && req.query[key] !== 'all') {
                query[key] = { $in: Array.isArray(req.query[key]) ? req.query[key] : [req.query[key]] };
            }
        });

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (req.query.wilaya) {
            const wilayaList = Array.isArray(req.query.wilaya) ? req.query.wilaya : [req.query.wilaya];
            const sellers = await require('../models/User').find({ wilaya: { $in: wilayaList }, role: 'seller' }).select('_id');
            query.seller = { $in: sellers.map(s => s._id) };
        } else if (req.query.seller) {
            query.seller = req.query.seller;
        }

        let sortQuery = { createdAt: -1 };
        if (sort === 'price_asc') {
            sortQuery = { price: 1 };
        } else if (sort === 'price_desc') {
            sortQuery = { price: -1 };
        } else if (sort === 'newest') {
            sortQuery = { createdAt: -1 };
        }

        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(48, parseInt(req.query.limit) || 12);
        const skip  = (page - 1) * limit;

        console.log("=== API PRODUCTS GET ===");
        console.log("Original Query params:", req.query);
        console.log("Constructed Mongoose Query:", JSON.stringify(query, null, 2));

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('seller', 'name shopName')
                .sort(sortQuery)
                .skip(skip)
                .limit(limit),
            Product.countDocuments(query)
        ]);

        res.json({
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name shopName');
        if (!product) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }
        

        product.views = (product.views || 0) + 1;
        await product.save();

        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }
        res.status(500).send('Server Error');
    }
});

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error('Images only! (jpeg, jpg, png, webp)'));
    }
});

router.post('/', [auth, upload.single('image')], async (req, res) => {
    try {
        const { title, description, price, condition, category, authenticity, reference, brand, carModel } = req.body;

        if (req.user.role !== 'seller' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'غير مسموح لك بإضافة منتجات' });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : '/uploads/placeholder.webp';

        const newProduct = new Product({
            title,
            description,
            price,
            condition,
            category,
            authenticity,
            reference,
            brand: brand || '',
            carModel: carModel || '',
            image: imagePath, 
            images: [imagePath], 
            stock: req.body.stock || 1,
            seller: req.user.id
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }

        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'غير مسموح لك بحذف هذا المنتج' });
        }

        await product.deleteOne();
        res.json({ message: 'تم حذف المنتج بنجاح' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', [auth, upload.single('image')], async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }

        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'غير مسموح لك بتعديل هذا المنتج' });
        }

        const { title, description, price, condition, category, authenticity, reference, brand, carModel } = req.body;

        if (title) product.title = title;
        if (description) product.description = description;
        if (price) product.price = price;
        if (condition) product.condition = condition;
        if (category) product.category = category;
        if (authenticity) product.authenticity = authenticity;
        if (reference !== undefined) product.reference = reference;
        if (brand !== undefined) product.brand = brand;
        if (carModel !== undefined) product.carModel = carModel;

        if (req.file) {
            const imagePath = `/uploads/${req.file.filename}`;
            product.image = imagePath;
            product.images = [imagePath];
        }

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
