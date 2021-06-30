const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("Hey its auth routes");
});

module.exports = router;