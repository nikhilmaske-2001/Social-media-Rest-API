const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("Hey its user routes");
});

module.exports = router;