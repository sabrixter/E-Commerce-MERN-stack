const express = require('express');
const Product = require('../dbs/products');
const { authMiddleware, sellerOnly } = require('../middleware/authMiddleware');

const router = express.Router();



// only seller (admin) permission to upload new product details
router.post("/add_prod", authMiddleware, sellerOnly, async (req, res) => {
    try {
        const {image, product_name, description, price} = req.body;

        // basic validation
        if (!product_name || !description || !price || !image) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (price <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        // if (discount < 0 || discount > price) {
        //     return res.status(400).json({ message: "Invalid discount" });
        // }
        console.log(req.user.id);
        const prod = new Product({
            image,
            product_name,
            description,
            price,
            createdBy: req.user.id, // 👈 ownership
        });
        console.log(prod);
        console.log('hi');
        await prod.save();

        return res.status(201).json(prod);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
);

// // only admin permission to upload new product details
// router.post('/add_prod',authMiddleware,selleronly,async (req,res) =>{
//     const {product_name,description,price,discount} = req.body;

//     try{
//         const prod = new products({product_name,description,price,discount});
//         await prod.save;
//         res.status(201).json(prod);
//     }
//     catch(error){
//         res.status(500).json({message: error.message});
//     }
// })




// listing all the products that are available now
router.get('/', async (req, res) => {
    try {
        const allproduct = await Product.find();
        res.json(allproduct);
    }
    catch (error) {
        res.status(500).json({ message: "product cant be found" });
    }
})


// product details when clicked on a product
router.get('/:id', async (req, res) => {
    const product_details = await Product.findById(req.params.id);
    res.json(product_details);
})



module.exports = router;
