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

// Delete a post
router.delete("/:id", async(req, res) => {
    try {
        // Find the post
        const post = await Post.findById(req.params.id);
        // Verify if post is trying to delete by its own user
        if(post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The post has been deleted");
        } else {
            res.status(403).json("You can only delete your own post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Like and dislike a post
router.put("/:id/like", async(req, res) => {
   try {
       // Find the post
       const post = await Post.findById(req.params.id);
        // if post is not liked, then liked
        // else dislike the same post
       if(!post.likes.includes(req.body.userId)) {
           await post.updateOne({ $push: { likes: req.body.userId }});
           res.status(200).json("The post has been liked");
       } else {
           await post.updateOne({ $pull: { likes: req.body.userId}});
           res.status(200).json("The post has been disliked");
       }
   } catch (error) {
       res.status(500).json(error);
   } 
});

module.exports = router;