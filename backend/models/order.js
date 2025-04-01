const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    itemsPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    status:{ type: String, enum: ['Pending', 'Delivered', 'Cancelled'],},
    paidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);