const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const mongoose = require('mongoose');

const router = express.Router();

// @desc Get a post
// @route GET /api/posts/:id
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).send(post);
    } catch (e) {
        res.status(500).send({ "error": e.message });
    }
});

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return cb(new Error("Upload .jpg, .jpeg, .png"));
        cb(undefined, true);
    }
});

// @desc Create post
// @route POST /api/posts
// @access Protected
router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        let buffer = null;
        if (req.file) {
            buffer = await sharp(req.file.buffer).png().toBuffer();
        }
        const newPost = new Post({
            userId: mongoose.Types.ObjectId(req.body.userId),
            description: req.body.description,
            image: buffer
        });
        await newPost.save();
        res.status(200).send(newPost);
    } catch (err) {
        res.status(500).send({ "error": err.message });
    }
});

// @desc Update post
// @route PUT /api/posts/:id
// @access Protected
router.put('/:id', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ "error": "Post not found" });
        }
        if (post.userId === req.userId) {
            updates.forEach((update) => post[update] = req.body[update]);
            await post.save();
            res.status(200).send(post);
        } else {
            res.status(403).send({ "error": "Access restricted" });
        }
    } catch (err) {
        res.status(500).send({ "error": err.message });
    }
});

// @desc Delete post
// @route DELETE /api/posts/:id
// @access Protected
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ "error": "Post not found" });
        }
        if (post.userId === req.userId) {
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).send({ "message": "Post deleted" });
        } else {
            res.status(403).send({ "error": "Access restricted" });
        }
    } catch (err) {
        res.status(500).send({ "error": err.message });
    }
});

// @desc Like / dislike a post
// @route PUT /api/posts/:id/like
// @access Protected
router.put('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.userId)) {
            post.likes.push(req.userId);
            await post.save();
            res.status(200).send({ "message": "Liked the post" });
        } else {
            post.likes = post.likes.filter(post => post !== req.userId);
            await post.save();
            res.status(200).send({ "message": "Unliked the post" });
        }
    } catch (e) {
        res.status(500).send({ "error": err.message });
    }
});

// @desc Get timeline post
// @route GET /api/posts/timeline/all
// @access Protected
router.get('/timeline/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: req.params.userId });
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).send(userPosts.concat(...friendPosts))
    } catch (e) {
        res.status(500).send({ "error": e.message });
    }
});

// @desc Get user's posts
// @route GET /api/posts/profile/:username
// @access Public
router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const userPosts = await Post.find({ userId: user._id });
        res.status(200).send(userPosts)
    } catch (e) {
        res.status(500).send({ "error": e.message });
    }
});

// @pending Add routes to add, update and delete comment

module.exports = router;