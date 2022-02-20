const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// @desc Get user
// @route GET /api/users?username=<>
// @route GET /api/users?userId=<>
// @access Public
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username });
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send({ "error": e.message })
    }
});

// @desc Update user
// @route PUT /api/users/:id
// @access Protected
router.put("/:id", auth, async (req, res) => {
    if (req.userId === req.params.id || req.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            await user.save();
            res.status(200).send({ "message": "Account update successful" });
        } catch (e) {
            res.status(500).send({ "error": e.message });
        }
    } else {
        res.status(403).send({ "message": "Access restricted" });
    }
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Protected
router.delete("/:id", auth, async (req, res) => {
    if (req.userId === req.params.id || req.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).send({ "message": "Account delete successful" });
        } catch (e) {
            res.status(500).send({ "error": e.message });
        }
    } else {
        res.status(403).send({ "message": "Access restricted" });
    }
});

// @desc Get user's friends list
// @route GET /api/users/friends/:userId
// @access Public
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map((friend) => {
                return User.findById(friend);
            })
        );
        let friendsList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendsList.push({ _id, username, profilePicture });
        });

        res.status(200).send(friendsList);
    } catch (err) {
        res.status(500).send({ "error": err.message });
    }
});

// @desc Follow a user
// @route PUT /api/users/:id/follow
// @access Protected
router.put("/:id/follow", auth, async (req, res) => {
    if (req.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.userId);

            if (!user.followers.includes(req.userId)) {
                user.followers.push(req.userId);
                currentUser.following.push(req.params.id);
                await user.save();
                await currentUser.save();
                res.status(200).send({ "message": "Followed the user" });
            } else {
                res.status(403).send({ "message": "Already following the user" });
            }
        } catch (e) {
            res.status(400).send({ "error": e.message });
        }
    } else {
        res.status(403).send({ "message": "Cannot follow yourself" });
    }
});

// @desc Unfollow a user
// @route PUT /api/users/:id/unfollow
// @access Protected
router.put("/:id/unfollow", auth, async (req, res) => {
    if (req.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.userId);

            if (user.followers.includes(req.userId)) {
                user.followers = user.followers.filter((item) => {
                    return item !== req.userId;
                });
                currentUser.following = currentUser.following.filter(item => item !== req.params.id);
                await user.save();
                await currentUser.save();
                res.status(200).send({ "message": "Unfollowed the user" });
            } else {
                res.status(403).send({ "message": "Already unfollowing the user" });
            }
        } catch (e) {
            res.status(400).send({ "error": e.message });
        }
    } else {
        res.status(403).send({ "message": "Cannot unfollow yourself" });
    }
});
module.exports = router;