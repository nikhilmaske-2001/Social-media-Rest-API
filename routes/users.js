const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Update the user
router.put("/:id", async(req, res)=> {
    // Check if input user id matches with db userId and it is Admin
    if(req.body.userId === req.params.id || req.user.isAdmin) {
        // Check if password matches with the db
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req,body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        // Update the req.body by finding the user by its Id
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
});

// Delete the user
router.delete("/:id", async(req, res)=> {
    // Check if input user id matches with db userId and it is Admin
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        // Delete the user by finding the user by its Id
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
});

// get a user
router.get("/", async(req, res) => {
    // Here we are using a query 
    // something like this: /username if username is available
    // else /userId
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        // Find the user by its userId if available else use username
        const user = userId ? await User.findById(req.params.id) : await User.findOne({username: username});
        // Do not show the password and updatedAt as it is confidential
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(404).json(error);
    }
});

// Follow a user
router.put("/:id/follow", async(req, res) => {
    // Verify if user trying to follow itself
    if(req.body.userId !== req.params.id) {
        try {
            // currentUser following user
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            // Verify if user already follow the currentUser
            if(!user.followers.includes(req.body.userId)) {
                // Push follower in currentUser
                await user.updateOne({ $push : { followers: req.body.userId } });
                // Push following in user
                await currentUser.updateOne({ $push : { following: req.params.id }});
                res.status(200).json("User has been followed");
            } else {
                res.status(403).json("You already follow this user");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You cannot follow yourself");
    }
});

// ToDo: Something is not working
// Unfollow a user
router.put("/:id/unfollow", async(req, res) => {
    // Verify if user trying to unfollow itself
    if(req.body.userId !== req.params.id) {
        try {
            // currentUser unfollowing user
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            // Verify if user follow the currentUser
            if(user.followers.includes(req.body.userId)) {
                // Pull follower in currentUser
                await user.updateOne({ $pull : { followers: req.body.userId } });
                // Pull following in user
                await currentUser.updateOne({ $pull : { following: req.params.id }});
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(403).json("You cannot unfollow this user");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You cannot follow yourself");
    }
});

module.exports = router;