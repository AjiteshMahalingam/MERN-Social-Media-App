const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members: {
        type: Array
    },
}, {
    timestamps: true
});

const Conversation = mongoose.model('conversation', ConversationSchema);

module.exports = Conversation;