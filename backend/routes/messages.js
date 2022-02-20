const express = require('express');
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const mongoose = require('mongoose');

const router = express.Router();

// @desc Create new message
// @route POST /api/messages/
// @access Protected
router.post('/', auth, async (req, res) => {
    try {
        // console.log(req.body);
        const message = new Message({
            conversationId: mongoose.Types.ObjectId(req.body.conversationId),
            sender: mongoose.Types.ObjectId(req.userId),
            text: req.body.text
        });
        await message.save();
        // console.log(message);
        res.status(201).send(message);
    } catch (err) {
        res.status(500).send({ 'error': err.message });
    }
});

// @desc Get messages of conversation
// @route GET /api/messages/:conversationId
// @access Protected
router.get('/:conversationId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: mongoose.Types.ObjectId(req.params.conversationId)
        })
        res.status(201).send(messages);
    } catch (err) {
        res.status(500).send({ 'error': err.message });
    }
});

module.exports = router;