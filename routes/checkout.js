const express = require('express');
const { authMiddleware, buyerOnly } = require('../middleware/authMiddleware');
const cart = require('../dbs/carts');
const orders = require('../dbs/orders');
const user = require('../dbs/users');
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
require('dotenv').config();


const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});



// 1️⃣ Create Razorpay order
router.post("/create-order", authMiddleware, buyerOnly, async (req, res) => {
    const userId = req.user.id;
    const cartDetails = await cart.findOne({user: userId});
    
    const razorpayOrder = await razorpay.orders.create({
        amount: cartDetails.totalPrice * 100, // in paise
        currency: "INR",
        receipt: `rcpt_${userId}`
    });
    // console.log(razorpayOrder);
    res.json({
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount
    });
});



// 2️⃣ Verify payment and create DB order
router.post("/verify-payment", authMiddleware, buyerOnly, async (req, res) => {
    // console.log(req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    // console.log(razorpay_order_id , razorpay_payment_id,  razorpay_signature);
    const generatedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");
        
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false });
        }
        
        // Payment verified — create order in DB
        const userId = req.user.id;
        const cartDetails = await cart.findOne({user: userId});
        
        const order = new orders({
            user: userId,
            items: cartDetails.items,
            totalAmount: cartDetails.totalPrice,
            status: "PAID"
        });
        await order.save();
        await user.findByIdAndUpdate(userId, {
            $push: {
                orders: { order: order._id }
            }
        });

        await cart.findOneAndDelete({user: userId});
        
        res.json({ success: true });
});




module.exports = router;





        // router.post('/', authMiddleware, buyerOnly, async (req, res) => {
        //     const userId = req.user.id;
        //     const details = await cart.findById(userId);
        //     res.json(details);
        
        
        //     const order = new orders({ user: userId, items: details.items, totalAmount: details.totalPrice, status: 'PLACED' });
        //     await order.save();
        
        //     cart.findByIdAndDelete(userId);
        
        // })