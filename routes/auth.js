const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

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
    console.log(error);
  }
});

module.exports = router;