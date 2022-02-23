const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
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


// @desc Create post
// @route POST /api/posts
// @access Protected
router.post('/', auth, async (req, res) => {
    try {
        const newPost = new Post({
            userId: mongoose.Types.ObjectId(req.body.userId),
            description: req.body.description,
            image: req.body.image
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
        if (post.userId.toString() === req.userId) {
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

// @desc Post a comment
// @route POST /api/posts/:id/comment
// @access Protected
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.userId);
        const comment = {
            userId: mongoose.Types.ObjectId(req.body.userId),
            username: user.username,
            comment: req.body.comment,
            postedAt: req.body.postedAt
        }
        post.comments = [comment, ...post.comments];
        await post.save();
        res.status(201).send(comment);
    } catch (e) {
        res.status(500).send({ "error": err.message });
    }
});

// @desc Delete a comment
// @route DELETE /api/posts/:id/comment?postedAt=<>
// @access Protected
router.delete('/:id/comment', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const postedAt = req.query.postedAt;
        const isDeleted = false;
        post.comments = post.comments.filter(comment => {
            if (comment.userId.toString() === req.userId && comment.postedAt === postedAt) {
                isDeleted = true;
                return false;
            }
            return true;
        })
        await post.save();
        if (isDeleted)
            res.status(201).send({ 'message': 'Comment deleted' });
        else
            res.status(201).send({ 'message': 'Comment not deleted' });
    } catch (e) {
        res.status(500).send({ "error": err.message });
    }
});

// @desc Get timeline post
// @route GET /api/posts/timeline/:userId
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