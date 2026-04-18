const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
        min: 1,
        required: true
      },
      priceAtPurchase: {
        type: Number,
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Cart', cartSchema);










// const cart = new mongoose.Schema({
//     // product:{type: , }, list(multivalued) keys of product ids which will be a list of foreing keys here and a primary key in projuct.js
//     products: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         // ref: 'Product',   // name of Product model
//         required: true
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1
//       }
//     }
//   ],
//     price:{type:Number, required:true}

// })