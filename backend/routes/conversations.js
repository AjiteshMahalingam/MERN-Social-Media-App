const express = require('express');
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');

const router = express.Router();

// @desc Create new conversation
// @route POST /api/conversations/
// @access Public
router.post('/', async (req, res) => {
    try {
        const newConversation = new Conversation({
            members: [
                req.body.senderId,
                req.body.recvId
            ]
        });
        await newConversation.save();
        res.status(201).send(newConversation);
    } catch (err) {
        res.status(500).send({ 'error': err.message });
    }
});

// @desc Get conversation of a user
// @route GET /api/conversations/
// @access Protected
router.get('/', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.userId] }
        });
        res.status(200).send(conversations);
    } catch (err) {
        res.status(500).send({ 'error': err.message })
    }
});

module.exports = router;