const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register system
router.post("/register", async (req, res) => {
  try {
    // Hash the password so that it cannot be read from the db
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new User
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    // Save the user in the db
    const user = await newUser.save();
    res.send(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login system
router.post("/login", async (req, res)=> {
  try {
    const user = await User.findOne({email: req.body.email});
    !user && res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    !validPassword && res.status(400).json("Wrong password");
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;