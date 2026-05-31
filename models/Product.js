const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    condition: {
        type: String,
        enum: ['new', 'used'],
        required: true
    },
    authenticity: {
        type: String,
        enum: ['original', 'fake'],
        required: true
    },
    reference: {
        type: String,
        trim: true,
        default: ''
    },
    brand: {
        type: String,
        trim: true,
        default: ''
    },
    carModel: {
        type: String,
        trim: true,
        default: ''
    },
    image: {
        type: String 
    },
    images: [{
        type: String 
    }],
    views: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 1
    },
    category: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'hidden'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
