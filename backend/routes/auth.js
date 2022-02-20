const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// @desc Register new user
// @route POST /api/auth/register
// @access Public
router.post("/register", async (req, res) => {
    try {
        const user = await new User(req.body);
        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        user.tokens.push({ token });
        await user.save();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send({ "Error": e.message })
    }
});

// @desc Login user
// @route POST /api/auth/login
// @access Public
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.send(404).send({ "Error": "User not found" });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            res.send(400).send({ "Error": "Invalid login credentials" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        user.tokens.push({ token });
        await user.save();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send({ "Error": e.message })
    }
});

// @desc Get user from token
// @route POST /api/auth/token?token=<>
// @access Public
router.post('/token', async (req, res) => {
    try {
        const token = req.query.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user)
            return res.status(401).send({ 'error': 'Invalid token' });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send({ 'error': err.message });
    }
});

module.exports = router;