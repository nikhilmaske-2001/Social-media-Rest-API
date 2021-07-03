const router = require("express").Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const newUser = await new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const user = await newUser.save();
    res.send(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;