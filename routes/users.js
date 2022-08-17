const express = require("express");
const sequelize = require("../database");
const users = require("../models/users.model");
const Users = require("../models/users.model");
const router = express.Router();

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

sequelize.sync().then(() => console.log("Dabase is ready to update users route"));

//GET all users
router.get("/users", (req, res) => {
	Users.findAll({ attributes: ["name", "email", "home_address", "phone_no", "stack", "batch"] })
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => console.log(err));
});

//Login functionality
var transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: `${process.env.mailTrap_user}`,
		pass: `${process.env.mailTrap_password}`,
	},
});

//forgot password
router.post("/forgotpassword", (req, res) => {
	const data = req.body;
	Users.findOne({ where: { email: data.email } })
		.then((user) => {
			if (user) {
				var mailOptions = {
					from: process.env.EMAIL,
					to: user.email,
					subject: "Password reset from AGBADEV",
					html: `<p><b> Your login details for AGBADEV </b> </br> <b>Email: ${user.email}, password: ${user.password} <a href="http://localhost:4200">click here to login</a> </b></b></p> `,
				};

				transport.sendMail(mailOptions, function (err, info) {
					if (err) {
						console.log(err);
					} else {
						console.log("Email sent: " + info.response);
					}
				});
				res.status(200).json({ message: "Password sent to your email" });
			} else {
				res.status(200).json({ message: "Password sent to your email" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(501).json({ message: err });
		});
});
router.post("/login", (req, res) => {
	const userLogin = req.body;
	Users.findOne({ where: { email: userLogin.email } }).then((user) => {
		if (user && userLogin.password == user.password) {
			const response = { email: user.email, userType: user.userType };
			const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: "2h" });
			res.status(200).json({ token: accessToken });
		} else if (user && userLogin.password !== user.password) {
			res.status(501).json({ message: "Incorrect password" });
		} else {
			res.status(501).json({ message: "incorrect email and password" });
		}
	});
});

//update users
router.put("/users/:email", (req, res) => {
	let emailParam = req.params.email;
	console.log(emailParam);
	let mail = req.body.email;
	let name = req.body.name;
	Users.findOne({ where: { email: emailParam } })
		.then((user) => {
			if (user) {
				if (name) user.name = name;
				if (mail) user.email = mail;
				user.save();
				res.send("user updated");
			} else {
				throw "user with the email not found";
			}
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
});

//delete users
router.delete("/users/:email", (req, res) => {
	let emailParam = req.params.email;
	Users.destroy({ where: { email: emailParam } }).then((user) => {
		console.log(users);
		res.sendStatus(200);
	});
});

module.exports = router;
