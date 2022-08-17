const express = require("express");
const Users = require("../models/users.model");
const sequelize = require("../database");

const router = express.Router();

//
sequelize.sync().then(() => console.log("Database is connected and ready"));

router.post("/signup", (req, res) => {
	let user = req.body;
	let { name, email, phone_no, password, batch, country, home_address, stack, userType } = user;

	Users.create({ name, email, phone_no, password, batch, country, home_address, stack, userType })
		.then(() => {
			res.status(200).json({ message: "User registered successfully" });
		})
		.catch((err) => res.status(200).json({ message: "User with email already exist please sign in instead", message2: err.errors }));
});
module.exports = router;
