const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId
    },
    text: {
        type: String
    }
}, {
    timestamps: true
});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;