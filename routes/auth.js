const express = require('express');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const User = require('../dbs/users');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();


// User Registration
router.post('/register', async (req, res) => {
    const { username, fullname, email, phnumber, password, usertype } = req.body;

    try {
        const userExists = await User.findOne({ email }); //returns true if the email is already there and email has to be unique
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ username, fullname, email, phnumber, password, usertype });//creates a new object of the user schema and adds this 3 value to attributes
        await user.save();

        const token = jwt.sign({ id: user._id, usertype: user.usertype }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        // 👇 MUST check this first
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // simple password match
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, user: user, usertype: user.usertype }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;