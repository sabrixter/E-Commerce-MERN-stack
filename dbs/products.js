const mongoose = require ('mongoose');

const Productschema = new mongoose.Schema({
    image: {
      type: String, // URL to the image
      required: true,
    },
    product_name: {type:String, required: true},
    description: {type:String, required: true},
    price: {type:Number, required: true},
    // ratings: {type: Number, required: true},
    // discount: {type: Number, required:true},
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
    //   ref: "users",
      required: true,
    },
})

module.exports = mongoose.model('product',Productschema);