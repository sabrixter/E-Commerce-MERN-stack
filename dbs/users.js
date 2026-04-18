const mongoose = require ('mongoose');

const user = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true},
    // bio: {type: String},
    email: { type: String, required: true, unique: true },
    phnumber: { type: Number, required: true},
    password: { type: String, required: true },
    usertype: { type: String, required: true, enum: ["buyer", "seller"] },
    // orders: {}, will be foreign key later and will point to one or more orders ids
    orders: [
        {
          order: 
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',   // the orders the user has booked
            required: false
          }
        }
      ],


});

module.exports = mongoose.model('users',user);