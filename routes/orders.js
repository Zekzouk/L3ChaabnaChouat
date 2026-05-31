const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    try {
        const { items, shippingDetails, totalPrice, shippingCost } = req.body;
        
        let buyerId = undefined;
        const token = req.header('x-auth-token');
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                buyerId = decoded.user.id;
            } catch (err) {

            }
        }

        for (const item of items) {
            const product = await Product.findById(item.product || item.id);
            if (!product) continue;
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `الكمية المطلوبة من ${product.title} غير متوفرة (المتبقي: ${product.stock})` });
            }
        }

        const newOrder = new Order({
            buyer: buyerId,
            items: items.map(i => ({
                product: i.product || i.id,
                title: i.title,
                price: i.price,
                quantity: i.quantity || 1,
                seller: i.seller
            })),
            shippingDetails,
            totalPrice,
            shippingCost,
            status: 'pending'
        });

        const order = await newOrder.save();

        for (const item of items) {
            await Product.findByIdAndUpdate(item.product || item.id, { $inc: { stock: -(item.quantity || 1) } });
        }
        res.status(201).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/buyer', auth, async (req, res) => {
    try {
        const orders = await Order.find({ 
            buyer: req.user.id,
            hiddenByBuyer: { $ne: true } 
        }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/seller', auth, async (req, res) => {
    try {
        if (req.user.role !== 'seller' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const orders = await Order.find({
            'items.seller': req.user.id,
            hiddenBySeller: { $ne: true }
        }).populate('items.product', 'image title').sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

        const isSeller = order.items.some(item => item.seller.toString() === req.user.id);
        const isBuyer = order.buyer && order.buyer.toString() === req.user.id;

        if (!isSeller && !isBuyer && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'غير مسموح لك بتعديل هذا الطلب' });
        }

        if (isBuyer && !isSeller && req.user.role !== 'admin' && status !== 'canceled') {
            return res.status(401).json({ message: 'يمكنك فقط إلغاء طلبك الخاص' });
        }

        order.status = status;
        await order.save();

        res.json({ message: 'تم تحديث حالة الطلب بنجاح', order });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

        const isBuyer = order.buyer && order.buyer.toString() === req.user.id;
        const isSeller = order.items.some(item => item.seller.toString() === req.user.id);

        if (req.user.role === 'admin') {
            await order.deleteOne(); 
            return res.json({ message: 'تم حذف الطلب نهائياً بواسطة المسؤول' });
        }

        if (!isBuyer && !isSeller) {
            return res.status(401).json({ message: 'غير مسموح لك بإجراء هذا التعديل' });
        }

        if (isBuyer) order.hiddenByBuyer = true;
        if (isSeller) order.hiddenBySeller = true;

        await order.save();
        res.json({ message: 'تم إخفاء الطلب من قائمتك بنجاح' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
