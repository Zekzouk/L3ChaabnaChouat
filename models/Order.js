const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false 
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        title: String,
        price: Number,
        quantity: {
            type: Number,
            default: 1
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    shippingDetails: {
        name: String,
        phone: String,
        wilaya: String,
        commune: String,
        address: String,
        deliveryType: {
            type: String,
            enum: ['home', 'desk'],
            default: 'home'
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
        default: 'pending'
    },
    hiddenByBuyer: {
        type: Boolean,
        default: false
    },
    hiddenBySeller: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
