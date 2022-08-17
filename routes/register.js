const express = require("express");
const Users = require("../models/users.model");
const sequelize = require("../database");

const router = express.Router();

router.post("/signup", (req, res) => {
	let user = req.body;
	let { name, email, user_id, phone_no, password, batch, country, home_address, stack, userType } = user;
	sequelize
		.sync({ force: true })
		.then((result) => {
			return Users.create({ name, email, user_id, phone_no, password, batch, country, home_address, stack, userType });
		})
		.then((response) => {
			console.log(response);
			res.status(200).json({ message: "user registered" });
		})
		.catch((err) => console.log(err));
});
module.exports = router;
