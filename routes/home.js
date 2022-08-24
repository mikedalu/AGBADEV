const express = require("express");

const router = express.Router();

//HOME ROUTE
router.get("/", (req, res) => {
	res.render("welcome");
});

module.exports = router;
