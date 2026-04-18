const express = require('express');
const Cart = require('../dbs/carts');
const Product = require('../dbs/products');
// const  buyerOnly= require('../middleware/authMiddleware');
const {authMiddleware,buyerOnly } = require('../middleware/authMiddleware');
const router = express.Router();


//get cart
router.get('/', authMiddleware, buyerOnly, async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product", "product_name price image");

    if (!cart) {
      // if no cart exists yet, return empty cart structure
      return res.json({ items: [], totalPrice: 0 });
    }

    res.json(cart);
    // console.log(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




//adds a product or pushes a new item to cart if still not there.
router.post('/add/:prod_id', authMiddleware, buyerOnly, async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.prod_id;

    // userId is guaranteed to exist here (auth middleware)
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({
            user: userId,
            items: [
                {
                    product: productId,
                    quantity: 1,
                    priceAtPurchase: product.price
                }
            ],
            totalPrice: product.price
        });

        await cart.save();
        res.json(cart);
    }

    // Cart already exists → update it
    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
    } else {
        cart.items.push({
            product: productId,
            quantity: 1,
            priceAtPurchase: product.price
        });
    }

    cart.totalPrice += product.price;
    await cart.save();

    res.json(cart);
    // return cart;
})




// decrease product quantity in cart
router.patch('/decrease/:prod_id', authMiddleware, buyerOnly, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.prod_id;

  // 1. Find cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  // 2. Find item by productId
  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Product not in cart' });
  }

  const item = cart.items[itemIndex];

  // 3. Decrease or remove
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart.items.splice(itemIndex, 1);
  }

  // 4. Update total price
  cart.totalPrice -= item.priceAtPurchase;

  // 5. Save and respond
  await cart.save();
  res.json(cart);
  // return cart;
});




//delete an item from cart.
router.delete('/remove/:prod_id', authMiddleware, buyerOnly, async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.prod_id;

    //find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Product not in cart' });
    }


    const item = cart.items[itemIndex];
    cart.totalPrice -= item.priceAtPurchase * item.quantity;
    cart.items.splice(itemIndex, 1);

    await cart.save();
    res.json(cart);
    // return cart;
})


module.exports = router;