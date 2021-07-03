const router = require("express").Router();
const User = require("../models/User");

router.get("/register", async (req, res) => {
  const user = await new User({
    username: "test1",
    email: "test1@gmail.com",
    password: "test1"
  });

  await user.save();
  res.send("OK");
});

module.exports = router;