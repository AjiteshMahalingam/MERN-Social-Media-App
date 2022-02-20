const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    image: {
        type: Buffer
    },
    likes: {
        type: Array,
        default: []
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        username: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true,
            trim: true
        }
    }]
}, {
    timestamps: true
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;