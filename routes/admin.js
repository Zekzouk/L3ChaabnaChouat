const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const ShopRequest = require('../models/ShopRequest');
const auth = require('../middleware/auth');

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'دخول غير مصرح به. للمدراء فقط.' });
    }
    next();
};

router.get('/stats', auth, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'buyer' });
        const totalSellers = await User.countDocuments({ role: 'seller' });
        const totalProducts = await Product.countDocuments();
        
        res.json({
            totalUsers,
            totalSellers,
            totalProducts,
            revenue: 2400000 
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/shop-requests', auth, adminOnly, async (req, res) => {
    try {
        const requests = await ShopRequest.find()
            .populate('user', 'name email phone wilaya status')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.put('/users/:id/status', auth, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
        
        user.status = status;
        await user.save();
        

        if (user.role === 'seller') {
            let requestStatus = 'pending';
            if (status === 'active') requestStatus = 'approved';
            else if (status === 'banned') requestStatus = 'rejected';

            await ShopRequest.findOneAndUpdate(
                { user: user._id },
                { status: requestStatus },
                { new: true }
            );
        }
        
        res.json({ message: 'تم تحديث حالة المستخدم بنجاح', user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/products', auth, adminOnly, async (req, res) => {
    try {
        const products = await Product.find()
            .populate('seller', 'name shopName')
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
