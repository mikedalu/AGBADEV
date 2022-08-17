const express = require("express");
const sequelize = require("../database");
const Users = require("../models/users.model");
const router = express.Router();

router.get("/users", (req, res) => {
	sequelize
		.sync()
		.then(() => {
			return Users.findAll({});
		})
		.then((users) => res.send(users))
		.catch((err) => console.log(err));
});

//getAll users
router.get("/users", (req, res) => {});

module.exports = router;
