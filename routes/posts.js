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

// get a post
router.get("/:id", async (req, res) => {
    try {
        // Find a post
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

// get timeline posts
router.get("/timeline/:userId", async (req, res) => {
    try {
        //  Find the current user
        const currentUser = await User.findById(req.params.userId);
        // Find the current user posts
        const userPosts = await Post.find({ userId: currentUser._id });
        // Find the currnt users followings posts
        // const friendPosts = await Promise.all(
        //     currentUser.followings.map((friendId) => {
        //         return Post.find({ userId: friendId });
        //     })
        // );
        // // Concate the current user and its following posts
        // res.status(200).json(userPosts.concat(...friendPosts));
        res.status(200).json(userPosts);
    } catch (error) {
        res.status(500).json(error);
    }
});

// get user all posts
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username});
        const posts = await Post.find({userId : user._id});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;