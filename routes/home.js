const express = require("express");

const router = express.Router();

//HOME ROUTE
router.get("/", (req, res) => {
	res.status(200).send(`<h1>Welcome to AGBADEV </h1>`);
});

module.exports = router;
