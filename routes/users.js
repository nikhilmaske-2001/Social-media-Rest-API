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
router.get("/:id", async(req, res) => {
    try {
        // Find the user by its userId
        const user = await User.findById(req.params.id);
        // Do not show the password and updatedAt as it is confidential
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(404).json(error);
    }
});

module.exports = router;