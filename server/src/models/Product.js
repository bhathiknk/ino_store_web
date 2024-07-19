const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    categoryDescription: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    images: [
        {
            type: String,
        },
    ],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    isDiscount: {
        type: Boolean,
        default: false,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    isFreeShipping: {
        type: Boolean,
        default: false,
    },
    shippingCost: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    inStock: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
