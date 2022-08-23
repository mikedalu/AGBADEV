const bcrypt = require("bcrypt");
const express = require("express");
const Users = require("../models/users.model");
const sequelize = require("../database");

const router = express.Router();

const jwt = require("jsonwebtoken");

// sequelize.sync().then(() => console.log("Dabase is ready to update users route"));

//Login functionality

router.post("/login", async (req, res) => {
	const userLogin = req.body;

	//get into database then Sign in with JWT
	Users.findOne({ where: { email: userLogin.email } })
		.then(function (user) {
			if (user) {
				//note bcrypt function is used to decrypt and check if the store password match the plain one
				bcrypt.compare(userLogin.password, user.password)
					.then((result) => {
						if (result) {
							const response = { email: user.email, userType: user.userType };
							const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN_KEY, { expiresIn: "1h" });
							res.status(200).json({ token: accessToken });
						} else {
							res.status(401).json({ message: "wrong password" });
						}
					})
					.catch(function (err) {
						console.log(err);
					});
			} else {
				res.status(501).json({ message: "incorrect email and password" });
			}
		})
		.catch((err) => res.json({ message: err }));
});

module.exports = router;
