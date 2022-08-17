const express = require("express");
const sequelize = require("../database");
const users = require("../models/users.model");
const Users = require("../models/users.model");
const router = express.Router();

sequelize.sync().then(() => console.log("Dabase is ready to update users route"));

//GET all users
router.get("/users", (req, res) => {
	Users.findAll({})
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => console.log(err));
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
