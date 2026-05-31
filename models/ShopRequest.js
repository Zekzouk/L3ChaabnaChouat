const mongoose = require('mongoose');

const shopRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    storeName: {
        type: String,
        required: true,
        trim: true
    },
    commercialRegisterNumber: {
        type: String,
        required: true,
        trim: true
    },
    documentUrl: {
        type: String 
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('ShopRequest', shopRequestSchema);
