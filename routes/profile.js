const profile = require('../dbs/users');
const prods = require('../dbs/products');
const orders = require('../dbs/orders');
const express = require('express');
const { authMiddleware, sellerOnly, buyerOnly } = require('../middleware/authMiddleware');
const router = express.Router();


// fetch user details like user name
router.get('/', authMiddleware, async (req, res) => {
    const userid = req.user.id;
    // console.log(userid);
    try {
        const details = await profile.findOne({ _id: userid })
            .populate({
                path: 'orders.order',
                select: 'items totalAmount status createdAt',
                populate: {
                    path: 'items.product',
                    select: 'product_name price image'
                }
            });
        res.json(details);
        // console.log(details);
    } catch (error) {
        res.status(500).json({ message: "cannot fetch details" });
        console.log(error);
    }
});

router.get('/products', authMiddleware, sellerOnly, async (req, res) => {
    const sellerId = req.user.id;
    try {
        const products = await prods.find({ createdBy: sellerId });
        if (products.length === 0) {
            return res.status(404).json({
                message: "No products found for this seller"
            });
        }

        res.status(200).json(products);
        // console.log(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while fetching products"
        });
    }
});

router.get('/orders', authMiddleware, buyerOnly, async (req, res) => {
    const userid = req.user.id;
    try {
        const order = await orders.findOne({ user: userid });
        res.json(ord);
    }
    catch (error) {
        res.status(500).json({ message: "cannot fetch details" });
        console.log(error);
    }
})



module.exports = router;
