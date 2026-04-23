const express = require ('express');
const cors = require('cors');

// const { default: mongoose, Mongoose } = require('mongoose');
const mongoose = require ('mongoose');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const profileRoutes = require('./routes/profile');
const productRoutes = require('./routes/product');
require('dotenv').config();

const app = express();
const connectdb = async() =>{
    await mongoose.connect(process.env.uri);
    console.log("db connected mongooose");
}
connectdb();



app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/checkout',checkoutRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/product',productRoutes);


app.listen(process.env.PORT || 5000, ()=>console.log(`server running on port ${process.env.PORT || 5000}`));
