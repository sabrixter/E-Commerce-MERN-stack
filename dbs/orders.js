const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            priceAtPurchase: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'PLACED'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);














// const order = new mongoose.Schema({
//     price:{type: Number, required:true},
//     status:{type: String, required:true},
//     // cart_ordered:{} will be a foreign key and there will be a primary key in cart.js which will have a list of products which were ordered :(
//     carts: [
//         {
//           cart: {
//             type: mongoose.Schema.Types.ObjectId,
//             // ref: 'cart',   // list  of Product models or a cart
//             required: true
//           },
//         //   quantity: {
//         //     type: Number,
//         //     required: true,
//         //     min: 1
//         //   }
//         }
//       ],
// })