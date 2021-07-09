const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// Create a post
router.post("/", async (req, res) => {
    // Create a new Post
    const newPost = new Post(req.body);
    try {
        // Save the new Post
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update a post
router.put("/:id", async (req, res) => {
    try {
        // Verify if post is present in db
        const post = await Post.findById(req.params.id);
        // Verify its user post only
        if(post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Your post has been updated");
        } else {
            res.status(403).json("You can only update your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;