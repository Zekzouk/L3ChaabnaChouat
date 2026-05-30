const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const path = require('path');
const multer = require('multer');
const ShopRequest = require('../models/ShopRequest');

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
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/register', upload.single('shopFile'), async (req, res) => {
    try {
        const { name, email, password, phone, wilaya, role, shopName, commercialRegisterNumber } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'هذا البريد الإلكتروني مستخدم بالفعل' });
        }

        user = new User({
            name,
            email,
            password,
            phone,
            wilaya,
            role: role || 'buyer',
            shopName,
            status: role === 'seller' ? 'pending' : 'active'
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        if (role === 'seller') {
            const documentUrl = req.file ? `/uploads/${req.file.filename}` : '';
            const shopRequest = new ShopRequest({
                user: user._id,
                storeName: shopName || '',
                commercialRegisterNumber: commercialRegisterNumber || 'N/A',
                documentUrl,
                status: 'pending'
            });
            await shopRequest.save();
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, 
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        status: user.status,
                        shopName: user.shopName,
                        phone: user.phone,
                        wilaya: user.wilaya,
                        email: user.email
                    }
                });
            }
        );

    } catch (err) {
        console.error("REGISTRATION ERROR:", err);
        res.status(500).send('Server Error: ' + err.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' }); 
        }

        if (user.status === 'banned') {
            return res.status(403).json({ message: 'تم حظر هذا الحساب من قبل الإدارة' }); 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' }); 
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        status: user.status,
                        shopName: user.shopName,
                        phone: user.phone,
                        wilaya: user.wilaya,
                        email: user.email
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.put('/profile', auth, async (req, res) => {
    try {
        const { name, shopName, phone } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        if (name) user.name = name;
        if (shopName) user.shopName = shopName;
        if (phone) user.phone = phone;

        await user.save();
        

        const updatedUser = user.toObject();
        delete updatedUser.password;
        
        res.json({ message: 'تم تحديث الملف الشخصي بنجاح', user: updatedUser });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
